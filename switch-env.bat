@echo off
REM Environment Switcher for Windows (Batch Script)
REM Usage: switch-env.bat [local|dev]

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo Environment Switcher - CarbonEase
    echo ==================================
    echo.
    echo Usage: switch-env.bat [local^|dev]
    echo.
    echo Examples:
    echo   switch-env.bat local
    echo   switch-env.bat dev
    echo.
    goto end
)

set ENV=%1

if /i "%ENV%"=="local" (
    echo Switching to LOCAL environment...
    copy /Y server\.env.local server\.env
    echo Backend: Updated server\.env from .env.local
    echo Frontend: Use 'npm run dev' to start with local settings
    echo.
    echo Local environment ready!
    echo Backend API: http://localhost:3000/api
    echo Frontend: http://localhost:5173
) else if /i "%ENV%"=="dev" (
    echo Switching to DEV environment...
    copy /Y server\.env.dev server\.env
    echo Backend: Updated server\.env from .env.dev
    echo Frontend: Use 'npm run dev:build' for dev build
    echo Backend: Use 'npm start' to run in dev mode
    echo.
    echo Dev environment ready!
) else (
    echo Invalid environment: %ENV%
    echo Valid options: local, dev
    exit /b 1
)

:end
endlocal
