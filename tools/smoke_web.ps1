param(
  [int]$Port = 3004
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$nextCmd = Join-Path $root "node_modules/.bin/next.cmd"
$nextBuildDir = Join-Path $root ".next"
$nextBuildId = Join-Path $nextBuildDir "BUILD_ID"

if (-not (Test-Path $nextCmd)) {
  throw "Missing Next.js local binary. Run pnpm install first."
}

if (-not (Test-Path $nextBuildId)) {
  throw "Missing .next build output. Run pnpm build before web smoke test."
}

function Assert-Contains {
  param(
    [string]$Text,
    [string]$Needle,
    [string]$Label
  )

  if (-not $Text.Contains($Needle)) {
    throw "$Label does not contain expected text: $Needle"
  }
}

function Get-PageText {
  param([string]$Path)

  $uri = "http://127.0.0.1:$Port$Path"
  Write-Host "[CHECK] $uri"
  try {
    return (Invoke-WebRequest -UseBasicParsing -Uri $uri).Content
  }
  catch {
    throw "Request failed for $uri. $($_.Exception.Message)"
  }
}

function Test-PortOpen {
  param([int]$TargetPort)

  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $async = $client.BeginConnect("127.0.0.1", $TargetPort, $null, $null)
    if (-not $async.AsyncWaitHandle.WaitOne(250)) {
      return $false
    }
    $client.EndConnect($async)
    return $true
  }
  catch {
    return $false
  }
  finally {
    $client.Close()
  }
}

$requestedPort = $Port
for ($attempt = 0; $attempt -lt 20 -and (Test-PortOpen $Port); $attempt++) {
  $Port++
}

if (Test-PortOpen $Port) {
  throw "No free local port found from $requestedPort to $Port."
}

if ($Port -ne $requestedPort) {
  Write-Host "[INFO] Port $requestedPort is busy; using $Port instead."
}

$job = Start-Job -ArgumentList $root, $nextCmd, $Port -ScriptBlock {
  param($Root, $NextCmd, $Port)

  Set-Location $Root
  & $NextCmd start -p $Port
}

try {
  $ready = $false

  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Seconds 1

    if ($job.State -ne "Running") {
      Receive-Job $job -Keep | Write-Host
      throw "Next production server exited before it became ready."
    }

    if (Test-PortOpen $Port) {
      $ready = $true
      break
    }
  }

  if (-not $ready) {
    Receive-Job $job -Keep | Write-Host
    throw "Next production server did not listen on port $Port."
  }

  $homePage = Get-PageText "/"
  Assert-Contains $homePage 'lang="zh-CN"' "Home page"
  Assert-Contains $homePage "/_next/static/" "Home page"

  $legalAid = Get-PageText "/legal-aid"
  Assert-Contains $legalAid 'lang="zh-CN"' "Legal aid page"
  Assert-Contains $legalAid "/_next/static/" "Legal aid page"

  $regulations = Get-PageText "/regulations"
  Assert-Contains $regulations 'lang="zh-CN"' "Regulations page"
  Assert-Contains $regulations "/_next/static/" "Regulations page"

  $offline = Get-PageText "/offline"
  Assert-Contains $offline 'lang="zh-CN"' "Offline page"

  $manifest = Get-PageText "/manifest.json" | ConvertFrom-Json
  if ($manifest.start_url -ne "/") {
    throw "manifest.json start_url must be /"
  }
  if ($manifest.display -ne "standalone") {
    throw "manifest.json display must be standalone"
  }
  if (-not ($manifest.icons | Where-Object { $_.sizes -eq "192x192" })) {
    throw "manifest.json must include a 192x192 icon"
  }
  if (-not ($manifest.icons | Where-Object { $_.sizes -eq "512x512" })) {
    throw "manifest.json must include a 512x512 icon"
  }

  $serviceWorker = Get-PageText "/sw.js"
  Assert-Contains $serviceWorker "/offline" "Service Worker"
  Assert-Contains $serviceWorker "/manifest.json" "Service Worker"
  Assert-Contains $serviceWorker "requestUrl.origin !== self.location.origin" "Service Worker"

  $robots = Get-PageText "/robots.txt"
  Assert-Contains $robots "Sitemap:" "robots.txt"
  Assert-Contains $robots "Disallow: /api/" "robots.txt"

  $sitemap = Get-PageText "/sitemap.xml"
  Assert-Contains $sitemap "/calculator" "sitemap.xml"
  Assert-Contains $sitemap "/legal-aid" "sitemap.xml"

  Write-Host "[OK] Web smoke test passed at http://127.0.0.1:$Port"
}
finally {
  if ($job) {
    Receive-Job $job -Keep -ErrorAction SilentlyContinue | Write-Host
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -ErrorAction SilentlyContinue
  }
}
