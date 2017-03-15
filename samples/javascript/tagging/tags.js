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
var login = require('./login')
var msg = require('./msg')
var https = require('https')
var util = require('util')
var url = require('url')

var settingsFileName = "settings"
if (process.argv.length > 2) {
   settingsFileName = process.argv[2]
}
var settings = require("./" + settingsFileName)

login.loginToEndpoint(settings.ssoService, settings.endpoint, function(cookieValue) {
   var options = {
      host: settings.endpoint.host,
      port: settings.endpoint.port || 443,
      path: (settings.endpoint.path || '/') + 'rest/com/vmware/cis/tagging/tag',
      method: 'GET',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
      headers: {
         'Cookie': cookieValue
      }
   }

   https.request(options, function(res) {
      var str = ''
      var status = res.statusCode
      res.on('error', function(err) {
         console.log(err)
      })
      res.on('data', function(chunk) {
         str += chunk
      })
      res.on('end', function() {
         var data = JSON.parse(str)
         if (status != 200) {
             msg.logMessage(data)
             return
         }
         var numberOfTags = data.value.length
         util.print('Found ' + numberOfTags + ' tags:\n')
         for (var i = 0; i < numberOfTags; i++) {
            var tag = data.value[i]
            util.print(tag + "\n")
         }
      })
   }).end()
})

