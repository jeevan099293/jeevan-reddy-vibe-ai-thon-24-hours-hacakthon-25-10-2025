@echo off
echo.
echo ========================================================
echo    Smart Campus Platform - Startup Script
echo ========================================================
echo.

REM Change to the project directory
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Checking Python installation...
python --version
echo.

REM Check if MongoDB is running
echo [2/3] Checking MongoDB status...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is already running
) else (
    echo [INFO] MongoDB not running, attempting to start...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Could not start MongoDB service
        echo [INFO] Will try to start server anyway
    ) else (
        echo [OK] MongoDB service started
    )
)
echo.

REM Kill any existing Python processes to avoid port conflicts
echo [3/3] Cleaning up old server instances...
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo.

echo ========================================================
echo    Starting Smart Campus Flask Server...
echo ========================================================
echo.
echo Server will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================================
echo.

REM Start the Flask server
python app.py

REM If server stops, pause so user can see any error messages
if errorlevel 1 (
    echo.
    echo [ERROR] Server stopped with an error!
    pause
)
