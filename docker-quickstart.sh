#!/bin/bash
# Quick start script for Mind Buddy Docker setup
# This script sets up and starts the application with sensible defaults

set -e

echo "🚀 Mind Buddy Docker Quick Start"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env file exists, if not create from .env.docker
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 .env file not found. Creating from .env.docker...${NC}"
    cp .env.docker .env
    echo -e "${GREEN}✅ .env file created. Please review and update sensitive values.${NC}"
else
    echo -e "${GREEN}✅ .env file found.${NC}"
fi

# Ask user for dev or production mode
echo ""
echo "Choose deployment mode:"
echo "1) Development (hot reload, debug mode)"
echo "2) Production (optimized, requires build)"
read -p "Enter choice [1-2] (default: 1): " MODE
MODE=${MODE:-1}

if [ "$MODE" = "2" ]; then
    COMPOSE_FILE="docker-compose.yml"
    echo -e "${YELLOW}📦 Building Docker images (this may take 5-15 minutes)...${NC}"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    echo -e "${YELLOW}⚡ Starting in development mode with hot reload...${NC}"
fi

# Pull latest images
echo -e "${YELLOW}📥 Pulling base images...${NC}"
docker-compose -f "$COMPOSE_FILE" pull

# Build custom images
echo -e "${YELLOW}🔨 Building custom images...${NC}"
docker-compose -f "$COMPOSE_FILE" build

# Create volumes if they don't exist
echo -e "${YELLOW}📦 Creating volumes...${NC}"
docker-compose -f "$COMPOSE_FILE" config --volumes | grep -v '{}' | awk '{print $1}' | while read volume; do
    docker volume create "$volume" 2>/dev/null || true
done

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo ""
echo -e "${YELLOW}🏥 Checking service health...${NC}"

# Check MongoDB
if docker-compose -f "$COMPOSE_FILE" exec -T mongodb echo "ping" &>/dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB failed to start${NC}"
fi

# Check Backend
if curl -f http://localhost:5000/api/health &>/dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${YELLOW}⏳ Backend is starting...${NC}"
fi

# Check Frontend
if curl -f http://localhost:3000 &>/dev/null; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${YELLOW}⏳ Frontend is starting...${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Mind Buddy is starting up!${NC}"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   API Docs:  http://localhost:5000/api/health"
echo ""
echo "📊 Monitor logs with:"
echo "   docker-compose -f $COMPOSE_FILE logs -f"
echo ""
echo "🛑 Stop services with:"
echo "   docker-compose -f $COMPOSE_FILE down"
echo ""
echo "❤️  Happy coding!"
