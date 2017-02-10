# VMware vSphere Automation SDK for REST: Client Samples README for Tagging

The sample Javascript application demonstrates simple REST API calls to vSphere services.
In order to make the call, the sample also performs authentication against an SSO service.

**Note** You cannot run this sample in a browser. The sample requires Node.js.

The client samples for tagging are located in VMware-vSphere-Automation-SDK-REST/client/javascript/tagging/.

|Sample|Description|
|---------------|-----------------------------------------------|
|login.js       |Uses sso.js. Performs authentication and login.|
|msg.js         |Logs messages.|
|settings.js    |Defines SSO and vAPI endpoint settings.|
|sso.js         |Retrieves an SSO token.|
|tags.js        |Uses login.js, msg.js, settings.js. Retrieves the list of available tags.|
|package.json   |Package description for the NPM utility. Contains dependency information.|

## Configuration
To configure your environment to run the samples:
* Edit the vcenter/common/settings.js file and provide the real values for the SSO service host name,
REST endpoint host name, username, and password.

### Install Node.js

On Macintosh (with [Homebrew](https://brew.sh/) installed):

    $ brew install nodejs

On Ubuntu:

    $ sudo apt-get install nodejs

Install required node.js package(s):

    $ npm install

This will install all the necessary dependencies, please refer to the "dependencies" section in package.json to see the list of required packages.

## Sample Execution
To run a sample, use the following command format:

    $ node <sample-file> [settings file]

If you do not specify a settings file, the sample uses the settings.js file.

## VMware Resources
* [VMware {code}](https://code.vmware.com/home)
* [VMware Developer Community](https://communities.vmware.com/community/vmtn/developer)

Copyright &copy; 2015, 2017 VMware, Inc.  All rights not expressly granted herein are reserved.
