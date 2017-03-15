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
var apiPath = '/rest/vcenter/host';

/*
 * This function will make a GET request to the apiPath returning the
 * list of host items.
 */
function list() {
  return util.p(apiPath, 'get');
}

/*
 * This function will make a GET request to the apoiPath but include
* the passed in filter string as a query string to the GET request.
*/
function find(filter) {
  return util.p(apiPath + '?' + filter, 'get');
}

/*
 * This function will make a POST request to the apiPath to create a
 * new host. The call requires the folder to create the host under,
 * the hostname, the username and the password.
 */
function create(folder, hostname, username, password) {
  data = {
    "spec": {
        "force_add": true,
        "folder": folder,
        "hostname": hostname,
        "user_name": username,
        "password": password,
        "port": 443,
        "thumbprint_verification": "NONE"
    }
  };

  return util.p(apiPath, 'post', data);
}

/*
 * This function will make a POST request to the apiPath + the hostname
 * and add /connect to the end to initiate a host connection.
 */
function connect(hostname) {
  return util.p(apiPath + '/' + hostname + '/connect', 'post');
}

/*
 * This function will make a POST request to the apiPath + the hostname
 * and add /connect to the end to initiate a host connection.
 */
function disconnect(hostname) {
  return util.p(apiPath + '/' + hostname + '/disconnect', 'post');
}

/*
 * This function will make a DELETE request to the apiPath + the hostname
 * to delete the provided hostname.
 */
function del(hostname) {
  return util.p(apiPath + '/' + hostname, 'delete');
}

exports.list = list;
exports.create = create;
exports.connect = connect;
exports.disconnect = disconnect;
exports.delete = del;
exports.find = find;
