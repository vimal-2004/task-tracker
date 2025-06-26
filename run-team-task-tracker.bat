@echo off
REM Start the backend server
start "Backend" cmd /k "cd /d %~dp0server && npm start"
REM Start the frontend client
start "Frontend" cmd /k "cd /d %~dp0client && npm run dev" 