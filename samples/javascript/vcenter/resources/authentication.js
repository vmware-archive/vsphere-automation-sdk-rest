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

var unirest = require('unirest')
var settings = require('common/settings')
var util = require('common/utility');

var apiPath = '/rest/com/vmware/cis/session';

// this function does not use the utility p() call because it uses the .auth()
// to send in basic auth username/password. Thus, this function defines/returns
// its own Promise unlike other crud functions that should use the utility.p()
// call to return a promise.
function login() {
  return new Promise(function(resolve, reject) {
    unirest.post(settings.host + apiPath)
      .strictSSL(settings.ssl)
      .auth(settings.username, settings.password, true)
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .end(function (response) {
        if (response.code >= 200 && response.code <= 299) {
          // set the session token id as a global variable to avoid having to
          // pass it around.
          global.sessionId = response.body.value;
          resolve(response.body);
        } else
          reject(response.code);
      });
  });
}

function logout() {
  return util.p(apiPath, 'delete');
}

exports.login = login
exports.logout = logout
