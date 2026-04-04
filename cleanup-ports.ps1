# Clean up Node processes and free ports
Write-Host "🧹 Cleaning up Node processes and ports..." -ForegroundColor Cyan

# Kill all Node processes
Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Check if ports are free
$port3000 = netstat -ano 2>$null | findstr :3000
$port5000 = netstat -ano 2>$null | findstr :5000

if ($port3000) {
    Write-Host "⚠️  Port 3000 is still in use, attempting to force clear..." -ForegroundColor Yellow
    $pids = $port3000 | ForEach-Object { $_ -split '\s+' | select -Last 1 } | Get-Unique
    $pids | ForEach-Object { 
        if ($_) { 
            taskkill /PID $_ /F -ErrorAction SilentlyContinue 
        } 
    }
} else {
    Write-Host "✅ Port 3000 is free" -ForegroundColor Green
}

if ($port5000) {
    Write-Host "⚠️  Port 5000 is still in use, attempting to force clear..." -ForegroundColor Yellow
    $pids = $port5000 | ForEach-Object { $_ -split '\s+' | select -Last 1 } | Get-Unique
    $pids | ForEach-Object { 
        if ($_) { 
            taskkill /PID $_ /F -ErrorAction SilentlyContinue 
        } 
    }
} else {
    Write-Host "✅ Port 5000 is free" -ForegroundColor Green
}

# Remove Next.js build cache
if (Test-Path "campusxconnect\frontend\.next") {
    Write-Host "Cleaning Next.js build cache..." -ForegroundColor Yellow
    Remove-Item "campusxconnect\frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Build cache cleaned" -ForegroundColor Green
}

Write-Host "`n✨ Cleanup complete! You can now run npm dev" -ForegroundColor Cyan
