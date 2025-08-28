Write-Host "Stopping any existing processes on port 8081..." -ForegroundColor Yellow

# Get processes using port 8081
$processes = netstat -ano | Select-String ":8081" | ForEach-Object {
    $parts = $_ -split '\s+'
    $parts[-1]  # Get the PID
} | Sort-Object -Unique

if ($processes) {
    foreach ($processId in $processes) {
        Write-Host "Killing process $processId" -ForegroundColor Red
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "Could not kill process $processId" -ForegroundColor Yellow
        }
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "No processes found on port 8081" -ForegroundColor Green
}

Write-Host "Starting development server..." -ForegroundColor Green
npm run dev 