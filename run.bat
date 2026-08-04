@echo off
echo ====================================================
echo Starting Taiwan-Market-200-ET03 Project
echo ====================================================
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo [1/2] Installing dependencies...
    call npm install
) else (
    echo [1/2] Dependencies already installed.
)

echo [2/2] Launching development server...
echo Please leave this window open while using the app.
echo.
call npm run dev

pause
