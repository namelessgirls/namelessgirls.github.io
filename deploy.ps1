$OutputEncoding = [System.Text.Encoding]::UTF8

$gitPath = Join-Path (Get-Location).Path ".git_portable\bin\git.exe"
if (-not (Test-Path $gitPath)) {
    Write-Host "Error: Portable Git not found at $gitPath"
    return
}

# 1. Initialize repository first so we can apply local config without errors
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git Repository..."
    & $gitPath init
}

# 2. Configure local git identity after init
& $gitPath config user.name "namelessgirls"
& $gitPath config user.email "namelessgirls.contact@gmail.com"
& $gitPath branch -M main

# 3. Configure/Verify remote origin URL
$remoteUrl = "https://github.com/namelessgirls/namelessgirls.github.io.git"
$remotes = & $gitPath remote
if ($remotes -contains "origin") {
    & $gitPath remote set-url origin $remoteUrl
} else {
    & $gitPath remote add origin $remoteUrl
}

# 4. Commit all files
Write-Host "Adding files and committing changes..."
& $gitPath add -A
& $gitPath commit -m "Auto-deploy: Update BOOTH link and sync repository"

# 5. Push to GitHub (User might see GCM browser auth popup on first run)
Write-Host "Pushing to GitHub (namelessgirls.github.io)..."
Write-Host "NOTE: If this is the first run, a GitHub login popup will appear on your screen."
Write-Host "Please authorize it to complete the connection."
& $gitPath push -u origin main --force

Write-Host "Deploy process completed successfully!"
