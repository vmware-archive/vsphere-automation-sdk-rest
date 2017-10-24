function Get-rVM
{
    <#
	.SYNOPSIS
		Perform Rest API call to retrieve VM information from vCenter.
	.DESCRIPTION
        Perform Rest API call to retrieve VM information from vCenter.
    .PARAMETER vCenter
        A valid vCenter IP/Name is required at this time.
    .PARAMETER Headers
        Valid Headers need to be passed in.
    .PARAMETER Session
        Valid Session needs to be passed in.
    .EXAMPLE
        $vms = Get-rVM
	.NOTES
		No notes.
    #>
    try 
    {
        # Perform RestAPI call to vCenter to retrieve VM data.
        $ReturnData = Invoke-WebRequest -Uri https://$global:vCenter/rest/vcenter/vm -Method Get -Headers $global:session -UseBasicParsing
        $vms = (ConvertFrom-Json $ReturnData.Content).value
        $mydata = $vms | Format-Table name, Power_State, cpu_count, memory_size_MiB -AutoSize
        return $mydata    
    }
    Catch
    {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName		
        Write-Error "Error: $ErrorMessage $FailedItem"
        BREAK			
    }
}