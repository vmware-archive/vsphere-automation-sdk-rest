function New-rVIsession
{
    <#
	.DESCRIPTION
        Perform Rest API call to retrieve new Session token.
    .PARAMETER vCenter
        A valid vCenter IP/Name is required
    .PARAMETER Headers
        Valid Headers need to passed in.
    .EXAMPLE
        $global:session = New-rVisession -headers $headers -vCenter $vCenter
	.NOTES
		No Notes.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false)]
        [system.object]$headers,
        [Parameter(Mandatory = $true)]
        [string]$vCenter
    )    
    try 
    {
        # Perform Rest call to create session.
        $ReturnData = Invoke-WebRequest -Uri https://$vCenter/rest/com/vmware/cis/session -Method Post -Headers $headers -UseBasicParsing
        $token = (ConvertFrom-Json $ReturnData.Content).value
        $global:session = @{'vmware-api-session-id' = $token}
        return $global:session
    }
    Catch
    {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName		
        Write-Error "Error: $ErrorMessage $FailedItem"
        BREAK			
    }     
}