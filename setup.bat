@echo off
REM PlanMyTrip Quick Setup Script for Windows

echo 🚀 Welcome to PlanMyTrip Setup!
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🎯 Setup Complete! Next steps:
    echo.
    echo 1️⃣  Start the backend server:
    echo    npm start
    echo.
    echo 2️⃣  In another terminal, start a local server for the frontend:
    echo    python -m http.server 8000
    echo.
    echo 3️⃣  Open your browser:
    echo    http://localhost:8000
    echo.
    echo 💡 For development with auto-reload:
    echo    npm run dev
    echo.
    pause
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
