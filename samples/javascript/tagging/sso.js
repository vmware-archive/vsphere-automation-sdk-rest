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
var https = require('https')
var fs = require('fs')

function makeRequestXml(username, password) {
	var now = new Date()
   var created = now.toISOString()
	now.setHours(now.getHours() + 1)
	var expires = now.toISOString()

   return '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"> \
<SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"> \
   <ns5:Security xmlns="http://docs.oasis-open.org/ws-sx/ws-trust/200512" \
      xmlns:ns2="http://www.w3.org/2005/08/addressing" \
      xmlns:ns3="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" \
      xmlns:ns4="http://www.rsa.com/names/2009/12/std-ext/WS-Trust1.4/advice" \
      xmlns:ns5="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \
      <ns3:Timestamp> \
         <ns3:Created>' + created + '</ns3:Created> \
         <ns3:Expires>' + expires + '</ns3:Expires> \
      </ns3:Timestamp> \
      <ns5:UsernameToken> \
         <ns5:Username>' + username + '</ns5:Username> \
         <ns5:Password>' + password + '</ns5:Password> \
      </ns5:UsernameToken> \
   </ns5:Security> \
</SOAP-ENV:Header> \
<SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"> \
   <RequestSecurityToken \
         xmlns="http://docs.oasis-open.org/ws-sx/ws-trust/200512" xmlns:ns2="http://www.w3.org/2005/08/addressing" \
         xmlns:ns3="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" \
         xmlns:ns4="http://www.rsa.com/names/2009/12/std-ext/WS-Trust1.4/advice" \
         xmlns:ns5="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \
      <TokenType>urn:oasis:names:tc:SAML:2.0:assertion</TokenType> \
      <RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</RequestType> \
      <Lifetime> \
         <ns3:Created>' + created + '</ns3:Created> \
         <ns3:Expires>' + expires + '</ns3:Expires> \
      </Lifetime> \
      <Renewing Allow="true" OK="false" /> \
      <Delegatable>true</Delegatable> \
      <KeyType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer</KeyType> \
      <SignatureAlgorithm>http://www.w3.org/2001/04/xmldsig-more#rsa-sha256</SignatureAlgorithm> \
   </RequestSecurityToken> \
</SOAP-ENV:Body> \
</SOAP-ENV:Envelope>'
}


function extractToken(xmlResponse) {
   var token = xmlResponse.toString().match( /\<saml2:Assertion[\s\S]*\<\/saml2:Assertion\>/m ).toString()
   //For debug purposes uncomment the following line to see the token
   //dump(token, "./token.xml", "auth token")
   return token
}

function authenticate(ssoConnectionInfo, doAfterAuthentication) {
   var callback = function(res) {
      str = ''
      res.on('error', function(err) {console.log("ERROR in sso.authenticate", err)})
      res.on('data', function(chunk) {str += chunk})
      res.on('end', function() {
         console.log("SSO: Authenticated successfully")
         doAfterAuthentication(extractToken(str))
      })
   }
   var requestXml = makeRequestXml(ssoConnectionInfo.username, ssoConnectionInfo.password)
   https.request(makeAuthRequestOptions(ssoConnectionInfo, requestXml), callback).end(requestXml)
}

function makeAuthRequestOptions(ssoConnectionInfo, requestXml) {
   return {
      'host': ssoConnectionInfo.host,
      path: ssoConnectionInfo.path || '/sts/STSService/vsphere.local',
      port: ssoConnectionInfo.port || 443,
      method: 'POST',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
      headers: {
         'Content-type': 'text/xml; charset="UTF-8"',
         'Content-length': requestXml.length,
         'User-Agent': 'VMware/jsSample',
         'Connection': 'keep-alive',
         'SOAPAction': "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue"
      }
   }
}

function dump(value, filename, whatAmISaving) {
   fs.writeFile(filename, value, function(err){
      if (err) {
         console.log("Couldn't save " + whatAmISaving + " to " + filename)
      } else {
         console.log("Saved " + whatAmISaving + " to " + filename)
      }
   })
}

exports.authenticate = authenticate
