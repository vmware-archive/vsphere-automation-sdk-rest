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

var unirest = require('unirest')
var settings = require('common/settings')
var util = require('common/utility');
var apiPath = '/rest/vcenter/vm';

function list() {
  return util.p(apiPath, 'get');
}

function details(vm) {
  return util.p(apiPath + '/' + vm, 'get');
}

function find(filter) {
  return util.p(apiPath + '?' + filter, 'get');
}

function createDefaults(guestOS, datastore, folder, resourcePool) {
  data = {
    "spec": {
        "guest_OS": guestOS,
        "placement" : {
            "datastore": datastore,
            "folder": folder,
            "resource_pool": resourcePool
        }
    }
  };

  return util.p(apiPath, 'post', data);
}

function del(vm) {
  return util.p(apiPath + '/' + vm, 'delete');
}

function createDetails(details) {
  return util.p(apiPath, 'post', details);
}

function powerOn(vm) {
  return util.p(apiPath + '/' + vm + '/power/start', 'post');
}

function powerOff(vm) {
  return util.p(apiPath + '/' + vm + '/power/stop', 'post');
}

exports.list = list
exports.details = details
exports.find = find
exports.createWithDefaults = createDefaults
exports.createWithDetails = createDetails
exports.powerOn = powerOn;
exports.powerOff = powerOff;
exports.delete = del;
