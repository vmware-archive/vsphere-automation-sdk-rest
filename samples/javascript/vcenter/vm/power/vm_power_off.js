/*
 * *******************************************************
 * Copyright VMware, Inc. 2016.  All Rights Reserved.
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

var vmName;

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
  function findVMByName(callback) {
    console.log('Looking for VM with name ' + settings.vmName);
     vm.find('filter.names.1=' + settings.vmName).then(resp => {
       if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
         vmName = resp.body.value[0].vm;
         console.log('found it.. ' + vmName);
       }
       callback();
   }).catch(error => {
     console.log(JSON.stringify(error, null, 2));
     callback();
   });
 },
 function powerOff(callback) {
   console.log('Powering off ' + vmName);
   vm.powerOff(vmName).then(resp => {
     console.log(JSON.stringify(resp, null, 2));
     callback();
   }).catch(error => {
     console.log(JSON.stringify(error, null, 2));
     callback();
   });
 },
 function cleanup(callback) {
   if (settings.cleanup) {
     console.log('Cleaning up...');
     vm.powerOn(vmName).then(resp => {
       console.log(JSON.stringify(resp, null, 2));
     }).catch(error => {
       console.log(JSON.stringify(error, null, 2));
     });
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
