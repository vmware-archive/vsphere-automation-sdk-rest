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
var vm = require('resources/vms');
var async = require("async");

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
  function listVms(callback) {
    vm.list().then(resp => {
      console.log(JSON.stringify(resp.body,null,2));
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
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
