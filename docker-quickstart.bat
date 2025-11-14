@echo off
REM Quick start script for Mind Buddy Docker setup (Windows)
REM This script sets up and starts the application with sensible defaults

setlocal enabledelayedexpansion

echo.
echo 🚀 Mind Buddy Docker Quick Start
echo ==================================
echo.

REM Check if Docker and Docker Compose are installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop with Compose.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo 📝 .env file not found. Creating from .env.docker...
    copy .env.docker .env
    echo ✅ .env file created. Please review and update sensitive values.
) else (
    echo ✅ .env file found.
)

REM Ask user for dev or production mode
echo.
echo Choose deployment mode:
echo 1) Development (hot reload, debug mode)
echo 2) Production (optimized, requires build)
set /p MODE="Enter choice [1-2] (default: 1): "
if "%MODE%"=="" set MODE=1

if "%MODE%"=="2" (
    set COMPOSE_FILE=docker-compose.yml
    echo 📦 Building Docker images (this may take 5-15 minutes^)...
) else (
    set COMPOSE_FILE=docker-compose.dev.yml
    echo ⚡ Starting in development mode with hot reload...
)

REM Pull latest images
echo 📥 Pulling base images...
call docker-compose -f "%COMPOSE_FILE%" pull

REM Build custom images
echo 🔨 Building custom images...
call docker-compose -f "%COMPOSE_FILE%" build

REM Start services
echo 🚀 Starting services...
call docker-compose -f "%COMPOSE_FILE%" up -d

REM Wait for services to be healthy
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak

REM Check service health
echo.
echo 🏥 Checking service health...

REM Check Backend
echo Checking Backend...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ⏳ Backend is starting...
) else (
    echo ✅ Backend is running
)

echo.
echo 🎉 Mind Buddy is starting up!
echo.
echo 📍 Access points:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:5000
echo    API Docs:  http://localhost:5000/api/health
echo.
echo 📊 Monitor logs with:
echo    docker-compose -f %COMPOSE_FILE% logs -f
echo.
echo 🛑 Stop services with:
echo    docker-compose -f %COMPOSE_FILE% down
echo.
echo ❤️  Happy coding!
echo.
pause
