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

var foundHost, datacenterId, hostFolder;

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
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function removeHost(callback) {
    console.log('Removing host ' + settings.host1);
    host.delete(foundHost).then(resp => {
      console.log('host removed');
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
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
