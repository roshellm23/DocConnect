# DocConnect - Start Local Stack Script
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Starting DocConnect Full Stack Service " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Start PostgreSQL
Write-Host "[1/3] Starting PostgreSQL (Port 5433)..." -ForegroundColor Yellow
Start-Process -FilePath "C:\Program Files\PostgreSQL\17\bin\postgres.exe" -ArgumentList "-D", "$PSScriptRoot\database\pgdata", "-p", "5433" -WindowStyle Hidden

Start-Sleep -Seconds 2

# 2. Start Backend
Write-Host "[2/3] Starting Express Backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

Start-Sleep -Seconds 2

# 3. Start Frontend
Write-Host "[3/3] Starting React Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DocConnect is running successfully!    " -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:5173       " -ForegroundColor White
Write-Host "  Backend:   http://localhost:5000       " -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan
