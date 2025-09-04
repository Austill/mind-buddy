@echo off
echo Starting Mind Buddy Development Environment...
echo.

echo Starting Backend...
start "Backend" cmd /k "cd backend && python run.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
