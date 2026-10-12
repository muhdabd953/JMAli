param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("create", "reset")]
    [string]$Action,
    [Parameter(Mandatory = $true)]
    [string]$Email,
    [string]$Name,
    [string]$PhpPath = "C:\xampp\php\php.exe"
)

$ErrorActionPreference = "Stop"
$Email = $Email.Trim().ToLowerInvariant()
if ($Action -eq "create" -and [string]::IsNullOrWhiteSpace($Name)) {
    throw "Provide -Name when creating an admin account."
}
if (-not (Test-Path $PhpPath)) {
    throw "PHP CLI was not found at '$PhpPath'. Pass its location with -PhpPath."
}

$securePassword = Read-Host "Enter an admin password (at least 12 characters)" -AsSecureString
if ($securePassword.Length -lt 12) {
    throw "Password must be at least 12 characters."
}

$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
try {
    $scriptPath = if ($Action -eq "create") {
        Join-Path $PSScriptRoot "create-admin.php"
    } else {
        Join-Path $PSScriptRoot "reset-admin-password.php"
    }
    $phpArguments = if ($Action -eq "create") {
        @($scriptPath, $Email, $Name, "--stdin-password")
    } else {
        @($scriptPath, $Email, "--stdin-password")
    }
    $password | & $PhpPath @phpArguments
    $exitCode = $LASTEXITCODE
} finally {
    $password = $null
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}

if ($exitCode -ne 0) {
    exit $exitCode
}