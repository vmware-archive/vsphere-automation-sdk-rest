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

var unirest = require('unirest');
var settings = require('common/settings');
var auth = require('resources/authentication');
var datastore = require('resources/datastores');
var vm = require('resources/vms');
var host = require('resources/hosts');
var folder = require('resources/folders');
var resourcePool = require('resources/resource_pools');
var async = require("async");

var datastoreName, hostName, resourceGroup, vmFolder, vmId;

async.series([
  function login(callback) {
    console.log('logging in');
    auth.login().then(resp => {
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function findDatastore(callback) {
    console.log('retrieving datastore');
    datastore.find('filter.names.1=' + settings.datastore).then(resp => {
      if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
        datastoreName = resp.body.value[0].datastore;
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    })
  },
  function findHost(callback) {
    console.log('finding host');
    host.find('filter.names.1=' + settings.host1).then(resp => {
      if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
        hostName = resp.body.value[0].host;
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function findResourcePool(callback) {
    resourcePool.find('filter.names.1=Resources&filter.hosts.1=' + hostName).then(resp => {
      if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
        resourceGroup = resp.body.value[0].resource_pool;
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function findVMFolder(callback) {
    folder.find('filter.type=VIRTUAL_MACHINE&filter.names.1=Discovered virtual machine').then(resp => {
      if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
        vmFolder = resp.body.value[0].folder;
        console.log('folder is ' + vmFolder);
      }
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function createVm(callback) {
    console.log('Creating vm...');
    vmDetails = {
        "spec": {
            "name": settings.vmName,
            "guest_OS": "RHEL_7_64",
            "placement" : {
                "datastore": datastoreName,
                "folder": vmFolder,
                "resource_pool": resourceGroup
            },
            "memory": {
              "size_MiB": 4,
              "hot_add_enabled": true
            },
            "floppies": [],
            "cpu": {
              "hot_remove_enabled": true,
              "count": 1,
              "hot_add_enabled": true,
              "cores_per_socket": 1
            },
            "cdroms": [
                {
                    "type": "IDE",
                    "backing": {
                        "iso_file": settings.isoName,
                        "type": "ISO_FILE"
                    }
                }
            ],
            "disks": [
                {
                    "new_vmdk": {
                        "capacity": 1024
                    }
                }
            ]
        }
    };

    vm.createWithDetails(vmDetails).then(resp => {
      console.log(JSON.stringify(resp.body.value, null, 2));
      vmId = resp.body.value;
      console.log('created.');
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  },
  function cleanup(callback) {
    if (settings.cleanup) {
      console.log('Cleaning up...');
      vm.delete(vmId).then(resp => {
      }).catch(error => {
        console.log(JSON.stringify(error, null, 2));
      })
    }
    callback();
  },
  function logout(callback) {
    auth.logout().then(resp => {
      console.log('logged out');
      callback();
    }).catch(error => {
      console.log(JSON.stringify(error, null, 2));
      callback();
    });
  }
]);
