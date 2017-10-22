function Connect-rVIServer {
    <#
	.DESCRIPTION
		Retrieve a Session token from vSphere API server.
    .PARAMETER vCenter
        A valid vCenter IP/Name is required
	.EXAMPLE
        New-rVisession -vCenter $vCenter -Credential $Credentials
	.EXAMPLE
        New-rVisession -vCenter $vCenter -user "administrator@corp.local" -password "VMware1!"
    .EXAMPLE
        $session = New-rVisession -vCenter $vCenter
	.NOTES
        Returns a Session to the powershell console, If the variable is global it does not need
        to be catpured in a variable.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, ParameterSetName = 'Credential')]
        [Parameter(Mandatory = $true, ParameterSetName = 'PlainText')]
        [Parameter(Mandatory = $true, ParameterSetName = 'NoCreds')]
        [string]$vCenter,
        [Parameter(Mandatory = $true,
        ParameterSetName = 'Credential')]
        [System.Management.Automation.PSCredential]$Credential,
        [Parameter(Mandatory = $true,
        ParameterSetName = 'PlainText')]
        [string]$User,
        [Parameter(Mandatory = $true,
        ParameterSetName = 'PlainText')]
        [string]$StrPwd        
    )  
    try 
    {
        # Ensure the PowerShell environment is set up to ignore self signed certs.  
        Invoke-SSLIgnore
        # Determine the credential type to create appropriate header.
        if ($PSCmdlet.ParameterSetName -eq 'Credential') 
        {
            $global:headers = New-rViHeaders -Credentials $Credential
        }
        elseif ($PSCmdlet.ParameterSetName -eq 'PlainText') 
        {
            $SecurePassword = ConvertTo-SecureString -String $StrPwd -AsPlainText -Force
            $Credential = New-Object System.Management.Automation.PSCredential -ArgumentList ($user, $SecurePassword)
            $global:headers = New-rViHeaders -Credential $Credential
        }
        else 
        {
            # Prompt user for vCenter Username and password.
            $Credential = Get-Credential
            $global:headers = New-rViHeaders
        }     
        # Perform a Rest call and retrieve a token.
        $global:session = New-rVisession -headers $global:headers -vCenter $vCenter
        $User = $Credential.UserName
        $vCenterReturn = New-Object -TypeName PSObject
        $vCenterReturn | Add-Member -MemberType NoteProperty -Name Name -Value $vCenter 
        $vCenterReturn | Add-Member -MemberType NoteProperty -Name Port -Value "443" 
        $vCenterReturn | Add-Member -MemberType NoteProperty -Name User -Value $User 
        $vCenterReturn 
    }
    Catch
    {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName		
        Write-Error "Error: $ErrorMessage $FailedItem"
        BREAK			
    }    
}