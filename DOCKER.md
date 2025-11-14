# Mind Buddy - Docker Setup Guide

This guide provides comprehensive instructions for building and running Mind Buddy using Docker and Docker Compose.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29+)
- At least 4GB of free disk space (for MongoDB and ML models)
- 2GB+ RAM available for containers

## 🚀 Quick Start

### 1. Prepare Environment File

```bash
# Copy the example environment file
cp .env.docker .env

# Edit .env with your configuration
# Important: Change SECRET_KEY, JWT_SECRET_KEY, and MongoDB credentials
```

### 2. Build and Start All Services

```bash
# Build images and start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# Monitor the build process
docker-compose logs -f

# Wait for all services to be healthy (usually 1-2 minutes)
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **MongoDB**: localhost:27017 (with credentials from .env)

### 4. Stop Services

```bash
# Stop all services gracefully
docker-compose down

# Stop and remove all data (CAREFUL - deletes MongoDB data)
docker-compose down -v
```

---

## 🔧 Development Workflow

### Live Development (Hot Reload)

For development with live code changes, use the development compose file:

```bash
# Create docker-compose.dev.yml with volume mounts
# See "Development Configuration" section below

docker-compose -f docker-compose.dev.yml up
```

### Building Individual Services

```bash
# Rebuild backend image only
docker-compose build backend

# Rebuild frontend image only
docker-compose build frontend

# Rebuild all images
docker-compose build --no-cache
```

### Running Commands in Containers

```bash
# Run backend shell
docker-compose exec backend bash

# Run frontend shell
docker-compose exec frontend sh

# View backend logs
docker-compose logs -f backend

# View MongoDB logs
docker-compose logs -f mongodb
```

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin

# Inside mongosh:
# use mind_buddy
# db.users.find()
# db.journal_entries.find()
```

---

## 📦 Service Details

### Frontend Service

- **Base Image**: `node:20-alpine`
- **Port**: 3000 (configurable via FRONTEND_PORT)
- **Build**: Multi-stage build (~600MB final image)
- **Server**: Serves via `serve` package
- **Environment Variables**:
  - `VITE_API_BASE_URL`: Backend API URL
  - `VITE_API_URL`: Backend API URL (Vite proxy)

**Build Time**: ~3-5 minutes

### Backend Service

- **Base Image**: `python:3.11-slim`
- **Port**: 5000 (configurable via BACKEND_PORT)
- **Build**: Multi-stage build with wheel caching (~800MB final image)
- **Server**: Gunicorn (4 workers by default)
- **Key Packages**: Flask, PyTorch, Transformers, MongoDB driver
- **Environment Variables**: See `.env.docker`

**Build Time**: ~5-15 minutes (first build downloads PyTorch ~2GB)

### MongoDB Service

- **Image**: `mongo:latest`
- **Port**: 27017 (configurable via MONGO_PORT)
- **Authentication**: Enabled by default
- **Persistence**: `mongodb_data` volume
- **Health Check**: Enabled with `mongosh` ping

---

## 🌐 Networking & Communication

All services communicate via a custom Docker network `mindbuddy-network`:

```
Frontend (3000)
    ↓
Backend (5000)
    ↓
MongoDB (27017)
```

**Important URLs for service-to-service communication:**
- Frontend → Backend: `http://backend:5000`
- Backend → MongoDB: `mongodb://admin:password@mongodb:27017`

---

## 💾 Volumes & Data Persistence

### Persistent Volumes

- **`mongodb_data`**: Stores MongoDB databases and collections
- **`mongodb_config`**: Stores MongoDB configuration
- **`backend_cache`**: Caches HuggingFace LLM models (saves ~2GB+ on rebuilds)

### Optional Volume Mounts (Development)

To enable live code reload during development, use volume mounts:

```yaml
# backend volume
volumes:
  - ./backend:/app
  - backend_cache:/app/.cache

# frontend volume
volumes:
  - ./frontend:/app
```

**Note**: Volume mounts for development should be done with a separate `docker-compose.dev.yml`.

---

## 🔐 Security Considerations

### Production Checklist

- [ ] Change all credentials in `.env` (SECRET_KEY, JWT_SECRET_KEY, MongoDB password)
- [ ] Use strong, random passwords (minimum 16 characters)
- [ ] Set `FLASK_ENV=production`
- [ ] Use HTTPS in production (set CORS_ORIGINS accordingly)
- [ ] Mount `.env` as Docker secret in production
- [ ] Implement proper MongoDB backup strategy
- [ ] Use Docker networks with restricted access
- [ ] Keep container images updated regularly

### Default Credentials (CHANGE IN PRODUCTION!)

```
MongoDB Username: admin
MongoDB Password: securepassword123
```

---

## 🐛 Troubleshooting

### Issue: Backend can't connect to MongoDB

**Solution**: Ensure MongoDB is healthy first:
```bash
docker-compose logs mongodb
docker-compose ps  # Check if mongodb is Up
```

### Issue: Frontend can't connect to Backend

**Solution**: Verify CORS configuration:
```bash
# In .env, set CORS_ORIGINS to include frontend URL
CORS_ORIGINS=http://localhost:3000,http://frontend:3000

# Restart backend
docker-compose restart backend
```

### Issue: Out of disk space

**Solution**: Clean up unused Docker data:
```bash
docker system prune -a
docker volume prune

# Or remove only this project's volumes
docker-compose down -v
```

### Issue: Port already in use

**Solution**: Change port mappings in `.env` or docker-compose.yml:
```bash
FRONTEND_PORT=8080
BACKEND_PORT=5001
MONGO_PORT=27018
```

### Issue: Models downloading slowly

**Solution**: HuggingFace models are cached in `backend_cache` volume. First run is slow.
```bash
# Check cache size
docker-compose exec backend du -sh /app/.cache

# Pre-download models
docker-compose exec backend python -c "from transformers import AutoTokenizer, AutoModelForCausalLM; AutoTokenizer.from_pretrained('facebook/blenderbot-400M-distill')"
```

---

## 📊 Performance Optimization

### Recommended Settings

```env
# For development (low resource)
HF_MODEL_NAME=facebook/blenderbot-400M-distill
MAX_NEW_TOKENS=100

# For production (better quality)
HF_MODEL_NAME=facebook/blenderbot-1B-distill
MAX_NEW_TOKENS=256

# Gunicorn workers (in Dockerfile)
# 2-4 workers for typical load
# Increase for high-traffic production
```

### Memory Requirements

- **Minimal**: 4GB (all services, small model)
- **Recommended**: 8GB (for smooth operation)
- **Production**: 16GB+ (for backup, scaling)

---

## 🚢 Deployment to Production

### Deploying to Azure Container Instances

```bash
# 1. Create Azure resources
az group create --name mindbuddy-rg --location eastus

# 2. Build and push images to Azure Container Registry
az acr build --registry <acr-name> --image mindbuddy-backend:latest ./backend
az acr build --registry <acr-name> --image mindbuddy-frontend:latest ./frontend

# 3. Deploy using docker-compose to ACI
docker-compose -f docker-compose.yml --project-name mindbuddy up
```

### Deploying to Kubernetes

Create `k8s/` directory with manifests for Deployment, Service, ConfigMap, Secret:

```bash
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/mongodb.yml
kubectl apply -f k8s/backend.yml
kubectl apply -f k8s/frontend.yml
```

### Docker Hub Registry

```bash
# Tag images
docker tag mindbuddy-backend:latest username/mindbuddy-backend:1.0
docker tag mindbuddy-frontend:latest username/mindbuddy-frontend:1.0

# Push to Docker Hub
docker push username/mindbuddy-backend:1.0
docker push username/mindbuddy-frontend:1.0

# Update docker-compose.yml to use registry images
```

---

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/compose-file/)
- [Flask with Docker](https://flask.palletsprojects.com/en/2.3.x/deploying/docker/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)

---

## 🤝 Contributing

When modifying Docker setup:

1. Test locally with `docker-compose up`
2. Update documentation if adding new services
3. Update `.env.docker` with new environment variables
4. Test both development and production builds
5. Run `docker system prune` to clean up unused resources

---

**Last Updated**: November 2025
**Maintainer**: Mind Buddy Team
