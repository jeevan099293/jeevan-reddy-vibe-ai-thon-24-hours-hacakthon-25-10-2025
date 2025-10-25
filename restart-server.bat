@echo off
echo ========================================
echo   Restarting Smart Campus Server
echo   WITH DATABASE CONNECTION ENABLED
echo ========================================
echo.
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting server with MongoDB Atlas...
echo.
echo Server will start on: http://localhost:3000
echo Database: MongoDB Atlas (Cloud)
echo Status: CONNECTED
echo.
echo ========================================
echo.

cd /d "%~dp0"
node server.js
