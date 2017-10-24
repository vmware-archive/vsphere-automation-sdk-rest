function Invoke-SSLIgnore
{
    <#
	.DESCRIPTION
		Ignore SSL validation.
	.EXAMPLE
		Invoke-SSLIgnore
	.NOTES
		No additional notes.
    #>
    try 
    {    
        if (-not ([System.Management.Automation.PSTypeName]'ServerCertificateValidationCallback').Type)
        {
            $certCallback = @"
using System;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
public class ServerCertificateValidationCallback {
    public static void Ignore(){
        if(ServicePointManager.ServerCertificateValidationCallback ==null){
            ServicePointManager.ServerCertificateValidationCallback +=
            delegate(
                Object obj,
                X509Certificate certificate,
                X509Chain chain,
                SslPolicyErrors errors
            ){
                return true;
            };
        }
    }
}
"@
            Add-Type $certCallback
        }
        [ServerCertificateValidationCallback]::Ignore();
    }
    catch
    {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName		
        Write-Error "Error: $ErrorMessage $FailedItem"
        BREAK	       
    }

}