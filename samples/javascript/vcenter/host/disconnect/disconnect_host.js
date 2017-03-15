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
var async = require("async");

var hostId;

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
  function findConnectedHost(callback) {
    console.log('looking for connected host...');
    host.find('filter.names.1=' + settings.host1 + '&filter.connection_states.1=CONNECTED').then(resp => {
      if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
        hostId = resp.body.value[0].host;
        console.log('found connected host with id ' + hostId);
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function disconnectHost(callback) {
    if (null !== hostId) {
      console.log('disconnecting host...');
      host.disconnect(hostId).then(resp => {
        console.log('Disconnected');
        callback();
      }).catch(error => {
        console.log(JSON.stringify(error, null, 2));
        callback();
      })
    }
  },
  function cleanup(callback) {
    if (settings.cleanup) {
      console.log('Cleaning up...');
      host.connect(hostId).then(resp => {
      }).catch(error => {
        console.log(JSON.stringify(error, null, 2));
      })
    }
    callback();
  },
  function logout(callback) {
    auth.logout().then(resp => {
      console.log('logged out');
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  }
]);
