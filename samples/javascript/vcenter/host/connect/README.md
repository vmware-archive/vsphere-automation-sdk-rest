# VMware vSphere Host Connect Sample
This sample illustrates the following:

* Logging into vSphere
* Finding a disconnected host
* Connecting the disconnected host
* Optionally, clean up by restoring the host to the disconnected state if settings.cleanup = true (defaults to false)
* Logging out

Sample output:

    $ npm run connect_host
    logging in
    looking for disconnected host...
    found host with id host-19
    connecting host...
    Connected
    Cleaning up...
    logged out

Note: Upon execution the host *must* be disconnected for the script to run properly otherwise an error will occur.