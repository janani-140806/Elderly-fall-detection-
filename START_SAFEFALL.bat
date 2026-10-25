@echo off
title SafeFall AI - Server Launcher
color 0B
echo ========================================================
echo   SafeFall AI - Intelligent Fall Detection System
echo ========================================================
echo.
echo Starting local web server...
echo Please keep this window open while using the application.
echo.

cd /d "%~dp0"

start "" http://localhost:3000

npm run dev
