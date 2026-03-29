@echo off
title Sri Rama Prints - Starting...

echo Starting Sri Rama Prints...
echo.

REM Get the directory where this batch file is located
set "PROJECT_DIR=%~dp0"

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running
) else (
    echo Starting MongoDB...
    start "MongoDB" mongod
    timeout /t 3 /nobreak >nul
)

REM Start Backend
echo Starting Backend Server...
start "Backend" cmd /k "cd /d "%PROJECT_DIR%backend" && npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd /d "%PROJECT_DIR%frontend" && npm start"

REM Wait for frontend to start
timeout /t 10 /nobreak >nul

REM Open browser
echo Opening Sri Rama Prints in browser...
start http://localhost:3000

echo.
echo Sri Rama Prints is now running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Close this window to keep the application running.
pause