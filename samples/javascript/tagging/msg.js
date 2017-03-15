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
function logMessage(data) {
    console.log("Error: " + data.type)
    for (var i = 0; i < data.value.messages.length; i++) {
        var msg = data.value.messages[i]
        // Quick-and-dirty arg substitution into the default message
        pos = 0
        str = msg.defaultMessage.replace(/\%(s|d|f|tc)/g,
                  function (a, b) {
                      return msg.args[pos++];
                  })
        console.log(str)
    }
}

exports.logMessage = logMessage
