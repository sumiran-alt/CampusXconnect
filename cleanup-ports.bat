@echo off
REM Clean up Node processes and free ports
echo.
echo 🧹 Cleaning up Node processes and ports...
echo.

REM Kill all Node processes
echo Stopping all Node processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul

REM Kill any lingering node processes
taskkill /IM node.exe /F 2>nul

echo.
echo ✅ Ports cleaned up!
echo.
echo 💡 You can now run:
echo    cd backend
echo    npm run dev
echo.
echo    (In another terminal:)
echo    cd frontend  
echo    npm run dev
echo.
pause
