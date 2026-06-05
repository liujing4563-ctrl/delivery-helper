param(
  [string]$Url = "http://10.0.2.2:3000"
)

$ErrorActionPreference = "Stop"

if (-not $Url.StartsWith("http://") -and -not $Url.StartsWith("https://")) {
  throw "Url must start with http:// or https://"
}

$env:CAPACITOR_SERVER_URL = $Url
pnpm exec cap sync android
