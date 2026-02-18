@echo off
REM Environment Switcher for Windows - Edit .env file
REM Usage: switch-env.bat local  or  switch-env.bat dev

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo  ============================================
    echo  CarbonEase Environment Switcher
    echo  ============================================
    echo.
    echo  Usage: switch-env.bat [local^|dev]
    echo.
    echo  Examples:
    echo    switch-env.bat local
    echo    switch-env.bat dev
    echo.
    echo  Or manually edit .env files:
    echo    - server\.env
    echo    - client\.env
    echo.
    goto end
)

set ENV=%1

if /i "%ENV%"=="local" (
    echo.
    echo  ====================================
    echo  Switched to LOCAL environment
    echo  ====================================
    echo.
    echo  Backend API:  http://localhost:3000/api
    echo  Frontend:     http://localhost:5173
    echo.
    echo  Commands:
    echo    cd server ^&^& npm run dev
    echo    cd client ^&^& npm run dev
    echo.
) else if /i "%ENV%"=="dev" (
    echo.
    echo  ====================================
    echo  Switched to DEV environment
    echo  ====================================
    echo.
    echo  Backend API:  https://dev-api.carbonease.com/api
    echo  Frontend:     https://dev.carbonease.com
    echo.
    echo  Commands:
    echo    cd client ^&^& npm run dev:build
    echo    cd server ^&^& npm start
    echo.
) else (
    echo  ERROR: Invalid environment '%ENV%'
    echo  Valid options: local, dev
    exit /b 1
)

echo  NOTE: Edit .env files to configure API URLs and credentials
echo    - server\.env
    - client\.env
echo.

:end
endlocal
