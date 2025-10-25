#!/bin/bash

echo ""
echo "========================================================"
echo "   Smart Campus Platform - Startup Script"
echo "========================================================"
echo ""

# Change to the project directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python is not installed!"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

echo "[1/3] Checking Python installation..."
python3 --version
echo ""

# Check if MongoDB is running
echo "[2/3] Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo "[OK] MongoDB is already running"
else
    echo "[INFO] MongoDB not running, attempting to start..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community 2>/dev/null || echo "[WARNING] Could not start MongoDB"
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start mongod 2>/dev/null || echo "[WARNING] Could not start MongoDB"
    else
        echo "[WARNING] Please start MongoDB manually"
    fi
fi
echo ""

# Kill any existing Python processes on port 5001
echo "[3/3] Cleaning up old server instances..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
sleep 2
echo ""

echo "========================================================"
echo "   Starting Smart Campus Flask Server..."
echo "========================================================"
echo ""
echo "Server will start on: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================================"
echo ""

# Start the Flask server
python3 app.py

# If server stops, show message
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Server stopped with an error!"
    read -p "Press Enter to continue..."
fi
