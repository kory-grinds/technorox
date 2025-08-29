# PowerShell script to cleanly restart the development server
Write-Host "🔄 Restarting Technorox development server..." -ForegroundColor Cyan

# Kill any existing Node.js processes that might be using port 3000
Write-Host "🛑 Stopping existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Check if port 3000 is still in use
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "⚠️  Port 3000 is still in use. Attempting to free it..." -ForegroundColor Yellow
    $processId = $port3000.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Clear npm cache and node_modules/.vite
Write-Host "🧹 Clearing cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
}

# Start the development server with no HMR config
Write-Host "🚀 Starting development server (no HMR)..." -ForegroundColor Green
npm run dev -- --config vite.config.no-hmr.js
