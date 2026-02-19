@echo off
echo ========================================
echo  Energy Trading P2P - Complete Startup
echo ========================================

cd /d "%~dp0"

REM Check Node.js
echo Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo.
echo Starting services...
echo.

REM 1. Start Blockchain Service
echo [1/4] Starting Blockchain Service...
cd blockchain-service

if not exist venv (
    echo Virtual environment not found. Running setup...
    call setup.bat
)

start "Blockchain Service" cmd /k "venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

REM 2. Start Mining Worker
echo [2/4] Starting Mining Worker...
start "Mining Worker" cmd /k "venv\Scripts\activate && python worker.py"
timeout /t 2 /nobreak >nul

REM 3. Start Node.js Server
echo [3/4] Starting Node.js Server...
cd ..\server

if not exist node_modules (
    echo Installing server dependencies...
    call npm install
)

start "Node.js Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

REM 4. Start React Client
echo [4/4] Starting React Client...
cd ..\client

if not exist node_modules (
    echo Installing client dependencies...
    call npm install
)

start "React Client" cmd /k "npm run dev"

echo.
echo ========================================
echo  All services started successfully!
echo ========================================
echo.
echo Services running at:
echo • Blockchain Service: http://localhost:5001
echo • Node.js API:        http://localhost:3000
echo • React Client:       http://localhost:5173
echo.
echo Press any key to return...
pause >nul
