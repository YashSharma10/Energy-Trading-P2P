@echo off
echo ========================================
echo  Energy Trading Blockchain Service Setup
echo ========================================

REM Check if Python is installed
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo Found Python

REM Navigate to script directory
cd /d "%~dp0"

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo .env file created. Please update it with your configuration.
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the blockchain service:
echo 1. Activate virtual environment:
echo    venv\Scripts\activate
echo 2. Run the service:
echo    python app.py
echo.
echo Service will be available at: http://localhost:5001
echo.
pause
