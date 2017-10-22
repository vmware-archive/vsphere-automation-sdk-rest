function Get-rVisession
{
    param(
        [Parameter(Mandatory = $false)]
        [system.object]$head,
        [Parameter(Mandatory = $false)]
        [string]$vCenter
    )
    $r = Invoke-WebRequest -Uri https://$vCenter/rest/com/vmware/cis/session -Method Post -Headers $head -UseBasicParsing
    $token = (ConvertFrom-Json $r.Content).value
    $global:session = @{'vmware-api-session-id' = $token}
}