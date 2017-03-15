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
var apiPath = '/rest/vcenter/folder';

/*
 * This function will make a GET request to the apiPath returning the
 * list of folder items.
 */
function list() {
  return util.p(apiPath, 'get');
}

/*
 * This function will make a GET request to the apiPath returning the
 * specific items that match the passed in filter criteria.
 */
function find(filter) {
  return util.p(apiPath + '?' + filter, 'get');
}

exports.list = list;
exports.find = find;
