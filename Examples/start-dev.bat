@echo off
echo Stopping any existing processes on port 8081...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    echo Killing process %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo Starting development server...
npm run dev 