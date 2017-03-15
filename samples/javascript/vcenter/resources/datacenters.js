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

var apiPath = '/rest/vcenter/datacenter';

/*
 * This function will make a GET request to the apiPath returning the
 * list of datacenter items.
 */
function list() {
  return util.p(apiPath, 'get');
}

/*
 * This function will make a GET request to the apiPath returning the
 * specific datacenter id passed in if found.
 */
function details(datacenter) {
  return util.p(apiPath + '/' + datacenter, 'get');
}

/*
 * This function will make a GET request to the apiPath returning the
 * specific items that match the passed in filter criteria.
 */
function find(filter) {
  return util.p(apiPath + '?' + filter, 'get');
}

/*
 * This function will make a POST request to the apiPath to create a
 * new dataceter. The call requires the folder to create the host under,
 * and the name of the datacenter.
 */
function create(name, folder) {
  var data = {
    "spec": {
        "name": name,
        "folder": folder
    }
  };

  return util.p(apiPath, 'post', data);
}

/*
 * This function will make a DELETE request to the apiPath + the datacenter
 * to delete the provided datacenter.
 */
function del(datacenter, force) {
  return util.p(apiPath + '/' + datacenter + (force ? '?force=true' : ''), 'delete');
}

exports.list = list;
exports.details = details;
exports.find = find;
exports.create = create;
exports.delete = del;
