# Docker Setup Quick Reference - Mind Buddy

## 📁 Files Created

```
mind-buddy/
├── backend/
│   ├── Dockerfile              # Production backend image
│   └── .dockerignore           # Exclude unnecessary files
├── frontend/
│   ├── Dockerfile              # Production frontend image
│   ├── Dockerfile.dev          # Development frontend image
│   └── .dockerignore           # Exclude unnecessary files
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development with hot-reload
├── .env.docker                 # Example environment configuration
├── docker-quickstart.sh        # Linux/Mac quick start script
├── docker-quickstart.bat       # Windows quick start script
└── DOCKER.md                   # Comprehensive Docker guide
```

---

## ⚡ Quick Start (Choose One)

### Option 1: Automated Setup (Recommended)

**On Windows:**
```powershell
.\docker-quickstart.bat
```

**On Linux/Mac:**
```bash
chmod +x docker-quickstart.sh
./docker-quickstart.sh
```

### Option 2: Manual Setup

```bash
# 1. Prepare environment
cp .env.docker .env

# 2. Development mode (hot reload)
docker-compose -f docker-compose.dev.yml up

# OR Production mode
docker-compose up -d
```

---

## 🎯 Common Commands

| Task | Command |
|------|---------|
| **Start all services** | `docker-compose up -d` |
| **Start in development** | `docker-compose -f docker-compose.dev.yml up` |
| **View logs** | `docker-compose logs -f` |
| **View backend logs only** | `docker-compose logs -f backend` |
| **Stop all services** | `docker-compose down` |
| **Stop and remove volumes** | `docker-compose down -v` |
| **Rebuild images** | `docker-compose build --no-cache` |
| **Access MongoDB** | `docker-compose exec mongodb mongosh -u admin -p password` |
| **Backend shell** | `docker-compose exec backend bash` |
| **Frontend shell** | `docker-compose exec frontend sh` |

---

## 🌐 Access Points

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | React Vite app |
| Backend | http://localhost:5000 | Flask API |
| Health Check | http://localhost:5000/api/health | Verify backend is running |
| MongoDB | localhost:27017 | With auth: `admin`/`password` |

---

## 🔧 Configuration

### Environment Variables (.env)

Key variables to customize:

```env
# Flask
FLASK_ENV=production              # Set to 'development' for debug mode
SECRET_KEY=your-secret-key        # Change in production!
JWT_SECRET_KEY=your-jwt-secret    # Change in production!

# MongoDB
MONGO_ROOT_USERNAME=admin         # Change in production!
MONGO_ROOT_PASSWORD=password      # Change in production!

# APIs
CORS_ORIGINS=http://localhost:3000
VITE_API_URL=http://backend:5000

# LLM Models
HF_MODEL_NAME=facebook/blenderbot-400M-distill  # ~400MB
# Alternatives: facebook/blenderbot-1B-distill (~1GB, better quality)
```

---

## 📦 Architecture

```
┌─────────────────────────────────────────────────┐
│         Docker Network (mindbuddy-network)      │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │   Frontend   │  │   Backend    │             │
│  │  Port 3000   │  │  Port 5000   │             │
│  │  Node.js 20  │  │  Python 3.11 │             │
│  │  Vite/React  │  │  Flask/Gunicorn           │
│  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                    │
│         └──────────────────┼────────────────┐   │
│                            │                │   │
│                     ┌──────▼────────┐       │   │
│                     │   MongoDB     │       │   │
│                     │  Port 27017   │       │   │
│                     │  (Persistent) │       │   │
│                     └───────────────┘       │   │
│                                              │   │
│  ┌────────────────────────────────────────┬─┘   │
│  │            Volumes                     │     │
│  │  • mongodb_data (DB persistence)       │     │
│  │  • backend_cache (LLM models)          │     │
│  │  • mongodb_config (DB config)          │     │
│  └────────────────────────────────────────┘     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Development Workflow

### Using docker-compose.dev.yml

```bash
# 1. Start services with hot-reload
docker-compose -f docker-compose.dev.yml up

# 2. Edit code locally - changes instantly reflected
# Backend: http://localhost:5000 (Flask reload enabled)
# Frontend: http://localhost:3000 (Vite HMR enabled)

# 3. Monitor specific service
docker-compose -f docker-compose.dev.yml logs -f backend

# 4. Execute command in running container
docker-compose -f docker-compose.dev.yml exec backend python your-script.py
```

---

## 🔐 Security Best Practices

### For Development ✅
- Default credentials are fine
- FLASK_ENV=development is acceptable
- Debug mode enabled

### For Production ⚠️ CRITICAL
- [ ] Change all credentials in `.env`
- [ ] Set `FLASK_ENV=production`
- [ ] Use strong, random passwords (16+ chars)
- [ ] Set proper CORS_ORIGINS
- [ ] Use HTTPS in production
- [ ] Run with non-root user (✅ already configured)
- [ ] Mount `.env` as Docker secret
- [ ] Implement proper backups
- [ ] Use private Docker registry for images

---

## 🐛 Troubleshooting

### Backend can't connect to MongoDB
```bash
# Check MongoDB is running and healthy
docker-compose ps
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend can't reach Backend
```bash
# Verify CORS configuration in .env
CORS_ORIGINS=http://localhost:3000,http://frontend:3000

# Restart backend
docker-compose restart backend

# Check network
docker-compose exec frontend ping backend
```

### Port already in use
```bash
# Change port in .env
BACKEND_PORT=5001
FRONTEND_PORT=3001

# Or kill process on port
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -i :5000
```

### Out of disk space
```bash
# Clean up Docker system
docker system prune -a

# Or just this project's volumes
docker-compose down -v
```

### Models downloading slowly
```bash
# First run downloads PyTorch (~2GB) and models (~400MB-2GB)
# Subsequent runs use cached volumes
# To pre-download: docker-compose exec backend python -c "from transformers import AutoTokenizer; AutoTokenizer.from_pretrained('facebook/blenderbot-400M-distill')"
```

---

## 📊 Performance Tips

### For Development (faster builds)
```bash
# Use smaller model
HF_MODEL_NAME=facebook/blenderbot-400M-distill

# Lower resource limits if needed
```

### For Production (better quality)
```bash
# Use larger model (requires more resources)
HF_MODEL_NAME=facebook/blenderbot-1B-distill

# Increase Gunicorn workers in backend/Dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "8", ...]
```

---

## 📚 File Details

### Backend Dockerfile
- **Base**: python:3.11-slim
- **Strategy**: Multi-stage build (builder + runtime)
- **Benefits**: Minimal final image, faster rebuilds with wheel caching
- **Final Size**: ~800MB
- **Build Time**: 5-15 minutes (first time: 15+ min with PyTorch)

### Frontend Dockerfile
- **Base**: node:20-alpine
- **Strategy**: Multi-stage build (builder + runtime)
- **Server**: `serve` for static file serving
- **Final Size**: ~600MB
- **Build Time**: 3-5 minutes

### docker-compose.yml
- **MongoDB**: Latest stable, persistent volumes, health checks
- **Backend**: 4 Gunicorn workers, environment-based config
- **Frontend**: Static file serving via `serve`
- **Network**: Custom bridge network for service communication

### docker-compose.dev.yml
- **Volumes**: Source code mounted for hot-reload
- **Commands**: Override to run dev servers (Flask reload, Vite HMR)
- **Port Mapping**: All ports exposed for debugging

---

## 🎓 Learning Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Flask Docker Deployment](https://flask.palletsprojects.com/deploying/docker/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)

---

## 📝 Next Steps

1. **Run quick start script**: `./docker-quickstart.sh` or `docker-quickstart.bat`
2. **Access frontend**: http://localhost:3000
3. **Test backend**: curl http://localhost:5000/api/health
4. **Review DOCKER.md** for detailed documentation
5. **Customize .env** with your configuration

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Status**: Ready for Development & Production
