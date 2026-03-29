@echo off
title Sri Rama Prints - Stopping...

echo Stopping Sri Rama Prints...
echo.

REM Kill Node.js processes (Frontend & Backend)
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo Frontend and Backend stopped
) else (
    echo No Node.js processes found
)

REM Kill MongoDB if needed (optional - comment out if you want to keep MongoDB running)
REM taskkill /F /IM mongod.exe 2>nul

echo.
echo Sri Rama Prints has been stopped.
pause