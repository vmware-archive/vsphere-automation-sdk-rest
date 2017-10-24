function New-rVIHeaders
{
    <#
	.DESCRIPTION
		Gather Credentials to to add to Connection headers.
	.EXAMPLE
        New-rViHeaders
	.EXAMPLE
        New-rViHeaders -Credential $Credentials
    .EXAMPLE
        $global:headers = New-rViHeaders
	.NOTES
		No notes at this time.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [System.Management.Automation.PSCredential]$Credential
    )    
    try 
    { 
        $auth = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Credential.UserName + ':' + $Credential.GetNetworkCredential().Password))
        $global:headers = @{
            'Authorization' = "Basic $auth"
        }
        return $global:headers
    }
    Catch
    {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName		
        Write-Error "Error: $ErrorMessage $FailedItem"
        BREAK			
    }    
}