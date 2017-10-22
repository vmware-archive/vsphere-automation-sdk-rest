# PowerRestCLI  

Powershell Module providing Examples that consume vSphere Rest API

## Sample Metadata  

Original Author - Justin Sider @jpsider  
Date - 10/22/2017  
Description - Example Powershell vSphere API calls  
Limitations - This is just a sample, so many options!  
Environment - vCenter 6.5.0.10000  

## Notice  

### This is NOT an attempt to replace PowerCLI, It is intended to be a learning platform for PowerShell users to get started with to explore vSphere API via a familiar tool (PowerShell).  
This group of samples is meant to be used as a learning experience for those folks
  that would like to get started with REST API's using a tool they currently use or
  are comfortable with such as PowerShell.  
The Goal of this set of samples is to allow API Noobs learn how to interact with the
  vSphere API while using a familiar tool. I could see this being a valuable tool and
  used to drive local Hacks in the VMwareCode community.  
See my blog post for more details on why I opted to start this project.   
  http://invoke-automation.blog

## Getting Started  

Download the ZIP from Github
    Edit PathToModule\public\ConnectionVariables.ps1 to match your vCenter information.

Then Import the module:  

    Download the files to local machine
    Import-Module PathToModule\PowerRestCLI.psm1

## Try it out

### Connect to your vCenter  
    Connect-rVIServer -vCenter $vCenter  
        Enter the Username and password. Or  
    Connect-rVIServer -vCenter $vCenter -Credential $Creds  
    Connect-rVIServer -vCenter $vCenter -User Administrator@corp.local -Password VMware1!  

### Pull back VM information  
    Get-rVM  
        No filter options at this time.  

While the format is slightly different (mainly the column headers) It retrieves the same
    information from vCenter.

### PowerRestCLI output
    name                              power_state cpu_count memory_size_MiB  
    ----                              ----------- --------- ---------------  
    Embedded-vCenter-Server-Appliance POWERED_ON          2           10240  
    Win_7_Test_vm                     POWERED_OFF         1            2048  
    Win_10_test_vm                    POWERED_OFF         1            4096  
    CentOS_6_test_vm                  POWERED_OFF         1            2048  

### PowerCLI output
    Name                 PowerState Num CPUs MemoryGB  
    ----                 ---------- -------- -------  
    Win_7_Test_vm        PoweredOff 1        2.000  
    Win_10_test_vm       PoweredOff 1        4.000  
    CentOS_6_test_vm     PoweredOff 1        2.000  
    Embedded-vCenter-... PoweredOn  2        10.000  

Thats it for the first commit. I'm hoping to get some feedback to see if this is useful in
    helping PowerCLI focused folks learn how to interact with the vSphere API.  

## More Information

For more information  

* [github.com/jpsider/PowerRestCLI](https://github.com/vmware/vsphere-automation-sdk-rest/tree/master/samples/PowerRestCLI)  
* [jpsider.github.io](https://jpsider.github.io)  
* [BLOG Invoke-Automation](http://invoke-automation.blog)  
