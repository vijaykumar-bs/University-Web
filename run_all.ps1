# Vijay University Project - Run All Script
# This script starts the backend server and opens the application in the browser.

Write-Host "Starting Vijay University Management System..." -ForegroundColor Cyan

# 1. Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install it from https://nodejs.org/"
    exit
}

# 2. Setup Backend
Write-Host "`nSetting up Backend..." -ForegroundColor Yellow
cd backend

if (!(Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Gray
    npm install
}

# Ensure upload directories exist
$uploadDirs = @("uploads/photos", "uploads/marksheets", "uploads/stories", "uploads/reviews")
foreach ($dir in $uploadDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Gray
    }
}

# 3. Start Server and Open Browser
Write-Host "`nLaunching Server..." -ForegroundColor Green

# Use Start-Process to run the backend in a separate persistent window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"

# Wait a few seconds for the server to initialize
Start-Sleep -Seconds 4

# 4. Optional Seeding
$seed = Read-Host "`nDo you want to seed the database with sample data? (y/n)"
if ($seed -eq 'y') {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    node seed.js
    node seed_courses.js
    Write-Host "Seeding complete!" -ForegroundColor Green
}

# 5. Open Browser
Write-Host "`nOpening application in browser..." -ForegroundColor Gray
Start-Process "http://localhost:5000"

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "System is running at http://localhost:5000" -ForegroundColor Green
Write-Host "Admin Panel: http://localhost:5000/admin/dashboard.html" -ForegroundColor Cyan
Write-Host "Credentials: admin / admin123 (or vijay / 2002)" -ForegroundColor Gray
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "`nPress any key to exit this setup script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
