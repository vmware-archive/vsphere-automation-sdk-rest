# VMware vSphere Automation REST API Javascript Samples

This is a node/npm implementation of the VMware vSphere Automation REST APIs.

## Requirements
* Node 4+
* NPM 3+

## Settings

Before you can run any of the samples, you will need to configure the settings.js file found in this same directory.

In particular, you need to provide the URL to the host you will be running samples against, as well as the username and password for authentication to be successful. Some of the samples may make use of the other values in the settings.js file, namely the host1 and host2 ip addresses when adding new hosts, as well as the name of the datacenter, datastore and VM.

## Run examples

We have provided a few samples to show how to use the VMware vSphere Automation API. It is important to understand that the individual resource calls use a library called [Unirest](http://unirest.io/nodejs.html). This library is what makes the HTTP requests to the API. The nature of this library is that calls are made asynchronously. Because of this, our sample code makes use of javascript promises, and another library, [Async](https://github.com/caolan/async) to process the asynchronous calls in a synchronous order.

Also, the first call of each sample is to load a library called rootpath. This
allows subsequent require() calls to avoid using ../../ relative path syntax
when using modules we provide, such as those found in the resources/ and
common/ paths. Essentially it helps the code look a little prettier.

To execute the samples:

    npm run name-of-sample

 You will see output to the console as the sample executes.

 The samples provided are as follows:

|Sample     |Description                                  |
|-----------|---------------------------------------------|
|vm_details         |This sample shows the call chain to list the details of the specified virtual machine.|
|create_vm_with_details  |This sample will create a vm with the some of the configuration details found in common/settings.js. If successful, you can run the vm-details to verify the details of the created virtual machine, including its state.|
|create_vm_with_defaults |This sample is the simplest shortest way to create a virtual machine, only needing data from a couple of other resources. Take a look at the sample body to see how little data is passed in. The rest uses the VM defaults.|
|vm_power_on        |This sample will attempt to power on the specified virtual machine.|
|vm_power_off       |This sample will attempt to power off the specified virtual machine.|
|add_host           |This sample will add a host to a datacenter.|
|remove_host        |This sample will remove a host if it exists from a datacenter.|
|connect_host       |This sample will connect to a host.|
|disconnect_host    |This sample will disconnect a host.|
