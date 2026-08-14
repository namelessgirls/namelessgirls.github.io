@echo off
cd /d "%~dp0"
echo Starting deploy process...
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
echo.
echo Process finished.
pause
