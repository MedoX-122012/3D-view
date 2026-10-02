@echo off
title 3D Product Customizer
echo.
echo  ====================================
echo   3D Product Customizer - Dev Server
echo  ====================================
echo.

cd /d "%~dp0"

echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting dev server...
echo.
call npm run dev
