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
  function findDisconnectedHost(callback) {
    console.log('looking for disconnected host...');
    host.find('filter.names.1=' + settings.host1 + '&filter.connection_states.1=DISCONNECTED').then(resp => {
      if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
        hostId = resp.body.value[0].host;
        console.log('found host with id ' + hostId);
        callback();
      } else {
        console.log('cound not find a disconnected host');
        // Can't continue so log out
        auth.logout().then(resp => {
          console.log('logged out');
        }).catch(error => {
          console.log(JSON.stringify(error, null, 2));
        });
      }
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function connectHost(callback) {
    if (null !== hostId) {
      console.log('connecting host...');
      host.connect(hostId).then(resp => {
        console.log('Connected');
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
      host.disconnect(hostId).then(resp => {
        console.log('host disconnected');
        callback();
      }).catch(error => {
        console.log(JSON.stringify(error, null, 2));
        callback();
      })
    }
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
