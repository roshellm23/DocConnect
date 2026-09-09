# DocConnect - Stop Local Stack Script
Write-Host "Stopping DocConnect servers..." -ForegroundColor Yellow

# Kill postgres on port 5433 and node processes related to docconnect
& "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D "$PSScriptRoot\database\pgdata" stop -m fast

Get-NetTCPConnection -LocalPort 5000, 5173 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

Write-Host "DocConnect services stopped." -ForegroundColor Green
