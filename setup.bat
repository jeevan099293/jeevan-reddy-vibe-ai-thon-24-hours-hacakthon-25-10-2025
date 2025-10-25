@echo off
echo ====================================
echo Smart Campus - Quick Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
)

echo [1/5] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/5] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo [4/5] Checking environment file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo WARNING: Please edit .env file with your configurations!
    echo Press any key to open .env file in notepad...
    pause >nul
    notepad .env
)

echo.
echo [5/5] Setup complete!
echo.
echo ====================================
echo Next Steps:
echo ====================================
echo 1. Make sure MongoDB is running
echo 2. Edit .env file with your settings
echo 3. Run: python init_data.py (optional - adds sample data)
echo 4. Run: python app.py
echo 5. Visit: http://localhost:5000
echo.
echo ====================================
echo.

pause
