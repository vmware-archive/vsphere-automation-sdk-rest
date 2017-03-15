/*
 * *******************************************************
 * Copyright VMware, Inc. 2016.  All Rights Reserved.
 * SPDX-License-Identifier: MIT
 * *******************************************************
 *
 * DISCLAIMER. THIS PROGRAM IS PROVIDED TO YOU "AS IS" WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, WHETHER ORAL OR WRITTEN,
 * EXPRESS OR IMPLIED. THE AUTHOR SPECIFICALLY DISCLAIMS ANY IMPLIED
 * WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * NON-INFRINGEMENT AND FITNESS FOR A PARTICULAR PURPOSE.
 */
require('rootpath')();

var unirest = require('unirest');
var settings = require('common/settings');
var auth = require('resources/authentication');
var host = require('resources/hosts');
var datacenter = require('resources/datacenters');
var async = require("async");

var foundHost, datacenterId, hostFolder, hostId;

async.series([
  function login(callback) {
    console.log('logging in');
    auth.login().then(resp => {
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function checkIfHostExists(callback) {
    console.log('checking if host exists');
    host.find('filter.names.1=' + settings.host1).then(resp => {
      var val = resp.body.value;
      if (null !== val && val.length > 0) {
        foundHost = val[0].host;
        console.log('Host already exists.');
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function findDatacenterIdForName(callback) {
    // if host exists, skip this function
    if (null != foundHost) callback();

    console.log('Host does not exist. Find the datacenter id');
    datacenter.find('filter.names.1=' + settings.datacenter).then(resp => {
      if (null !== resp && null !== resp.body && resp.body.value.length > 0) {
         datacenterId = resp.body.value[0].datacenter;
      }

      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function findHostFolder(callback) {
    console.log('finding host folder to create host under');
    if (null != foundHost)
      callback();
    datacenter.details(datacenterId).then(resp => {
      if (null !== resp && null !== resp.body) {
        var val = resp.body.value;
        hostFolder = val.host_folder;
      }
      callback();
    }).catch(error => {
      callback();
    });
  },
  function addHost(callback) {
    console.log('Adding host ' + settings.host1 + ' to folder ' + hostFolder);
    host.create(hostFolder, settings.host1, settings.hostUsername, settings.hostPassword).then(resp => {
      console.log(JSON.stringify(resp.body, null, 2));
      hostId = resp.body.value;
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function cleanup(callback) {
    if (settings.cleanup) {
      console.log('Cleaning up...');
      host.delete(hostId).then(resp => {
      }).catch(error => {
        console.log(JSON.stringify(error, null, 2));
      })
    }
    callback();
  },
  function logout(callback) {
    auth.logout(null, sessionId).then(resp => {
      console.log('logged out');
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  }
]);
