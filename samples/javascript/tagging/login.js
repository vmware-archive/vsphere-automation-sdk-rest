/*
 * *******************************************************
 * Copyright VMware, Inc. 2014.  All Rights Reserved.
 * SPDX-License-Identifier: MIT
 * *******************************************************
 *
 * DISCLAIMER. THIS PROGRAM IS PROVIDED TO YOU "AS IS" WITHOUT
 * WARRANTIES OR CONDITIONS # OF ANY KIND, WHETHER ORAL OR WRITTEN,
 * EXPRESS OR IMPLIED. THE AUTHOR SPECIFICALLY # DISCLAIMS ANY IMPLIED
 * WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY # QUALITY,
 * NON-INFRINGEMENT AND FITNESS FOR A PARTICULAR PURPOSE.
 */
var sso = require('./sso')
var https = require('https')
var gzip = require("gzip-js")

function base64Encode(input) {
   return new Buffer(input)
      .toString('base64')
}

function loginToEp(ssoConnectionInfo, endpointConnectionInfo, doWithCookieValue) {
   sso.authenticate(ssoConnectionInfo, function(token) {
      var opts = makeLoginOptions(endpointConnectionInfo, token)
      https.request(opts, function(res) {
         res.on('error', function(err) {
            console.log("ERROR in loginToEp:", err)
         })
         res.on('data', function(chunk) {}) //ignore
         res.on('end', function() {
            var cookieValue = res.headers['set-cookie']
            console.log("Logged in into the endpoint. Cookie value will be: " + cookieValue)
            doWithCookieValue(cookieValue)
         })
      })
         .end()
   })
}

function makeAuthHeaderValues(b64Token) {
   var start = 0
   var prefix = "SIGN "
   var bufSize = 3 * 1024
   var result = []
   while (start < b64Token.length) {
      var end = start + bufSize
      result.push(prefix + 'token="' + b64Token.slice(start, end) + '"')
      start = end
      prefix = ""
   }
   return result
}

function makeLoginOptions(endpointConnectionInfo, token) {
   return {
      host: endpointConnectionInfo.host,
      port: endpointConnectionInfo.port || 443,
      path: (endpointConnectionInfo.path || '/') + "rest/com/vmware/cis/session",
      method: "POST",
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
      headers: {
         'Authorization': makeAuthHeaderValues(base64Encode(gzip.zip(token)))
      }
   }
}

exports.loginToEndpoint = loginToEp
