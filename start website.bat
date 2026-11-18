@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title AkaoraMeet - Local Test Server
set "PORT=4173"
set "SITE_URL=http://localhost:%PORT%/"

if not exist "index.html" (
    echo [ERROR] index.html not found.
    echo Put this BAT file inside the AkaoraMeet project folder, next to index.html.
    echo.
    pause
    exit /b 1
)

set "PYTHON_COMMAND="
py -3 --version >nul 2>&1
if not errorlevel 1 set "PYTHON_COMMAND=py -3"
if not defined PYTHON_COMMAND (
    python --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_COMMAND=python"
)
if not defined PYTHON_COMMAND (
    python3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_COMMAND=python3"
)

if not defined PYTHON_COMMAND (
    echo [ERROR] Python 3 is required to run this local test server.
    echo Install it from https://www.python.org/downloads/ and enable "Add Python to PATH".
    echo Then double-click this BAT file again.
    echo.
    pause
    exit /b 1
)

echo ===========================================
echo          AkaoraMeet - Test Website
echo ===========================================
echo.
echo Localhost address: %SITE_URL%
echo The browser will open automatically.
echo Leave this window open while you test.
echo Press Ctrl+C here to stop the website.
echo.

start "" /min powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process '%SITE_URL%'"
%PYTHON_COMMAND% -m http.server %PORT% --bind 127.0.0.1

if errorlevel 1 (
    echo.
    echo [ERROR] Could not start the server. Port %PORT% may already be in use.
    echo Close any other server on this port and try again.
    pause
    exit /b 1
)
endlocal
