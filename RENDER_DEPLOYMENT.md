# Deploying Mind Buddy to Render.com (Free Tier)

## 🎯 Overview

This guide explains how to deploy Mind Buddy to **Render.com free tier** using:
- **Backend**: Web Service (Flask + Gunicorn)
- **Frontend**: Static Site (React + Vite)
- **Database**: MongoDB Atlas (free tier)

**Why Render.com?**
- Free tier includes Web Services & Static Sites
- Auto-deploys from GitHub
- Easy environment management
- Great for hobby/learning projects

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Repository pushed to GitHub
2. **Render.com Account** - Free tier (signup at render.com)
3. **MongoDB Atlas Account** - Free tier cluster (already created!)
   - Connection string: `mongodb+srv://austin:misaro@cluster1.ynxgjwq.mongodb.net/?appName=Cluster1`
4. **Git** - For pushing code

---

## 🚀 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Add Docker and Render configuration for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mind-buddy.git
git push -u origin main
```

### 1.2 Create Render Configuration Files

Skip this if you want manual setup - we'll cover both approaches.

---

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Web Service on Render

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the following:

   | Field | Value |
   |-------|-------|
   | **Name** | `mind-buddy-backend` |
   | **Environment** | `Docker` |
   | **Region** | `Ohio` (or closest to you) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |

5. Click **"Create Web Service"**

### 2.2 Configure Environment Variables

After creation, go to **Settings** → **Environment**:

```env
FLASK_ENV=production
SECRET_KEY=misaro
JWT_SECRET_KEY=misaro

# MongoDB Atlas
MONGO_URI=mongodb+srv://austin:misaro@cluster1.ynxgjwq.mongodb.net/?appName=Cluster1
MONGODB_DB_NAME=mind_buddy

# CORS - Update with frontend URL after deploying frontend
CORS_ORIGINS=http://localhost:3000

# Logging
LOGGING_LEVEL=INFO

# AI Model (use small model for free tier to save memory)
HF_MODEL_NAME=facebook/blenderbot-400M-distill
MAX_NEW_TOKENS=100
TEMPERATURE=0.7
TOP_P=0.9
```

### 2.3 Configure Build & Start Commands

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn --bind 0.0.0.0:$PORT wsgi:app
```

### 2.4 Wait for Deployment

- Render will build your Docker image
- First deployment takes ~5-10 minutes
- Check logs for any errors
- Your backend URL will be: `https://mind-buddy-backend.onrender.com`

⚠️ **Note the backend URL** - you'll need it for the frontend!

---

## 🎨 Step 3: Deploy Frontend to Render

### 3.1 Create Static Site on Render

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Fill in:

   | Field | Value |
   |-------|-------|
   | **Name** | `mind-buddy-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm ci && npm run build` |
   | **Publish Directory** | `dist` |

5. Click **"Create Static Site"**

### 3.2 Add Environment Variables

Go to **Settings** → **Environment**:

```env
VITE_API_BASE_URL=https://mind-buddy-backend.onrender.com
VITE_API_URL=https://mind-buddy-backend.onrender.com
```

⚠️ **Important**: Replace with your actual backend URL from Step 2.4!

### 3.3 Deploy

- Static site deploys faster (~2-3 minutes)
- Your frontend URL will be: `https://mind-buddy-frontend.onrender.com`

---

## 🔄 Step 4: Update Backend CORS

Now that you have the frontend URL, update the backend:

1. Go to **mind-buddy-backend** → **Settings** → **Environment**
2. Update `CORS_ORIGINS`:
   ```env
   CORS_ORIGINS=https://mind-buddy-frontend.onrender.com
   ```
3. Click **"Save"** - Backend will restart automatically

---

## ✅ Verification

Test your deployment:

1. **Open Frontend**: https://mind-buddy-frontend.onrender.com
2. **Test Backend**: `https://mind-buddy-backend.onrender.com/api/health`
3. **Check Console**: Open browser DevTools → Console to see any errors
4. **Test Login**: Try signing up/logging in

---

## ⚙️ Important: Free Tier Limitations

**Render Free Tier Restrictions:**

| Feature | Limit |
|---------|-------|
| Web Service | Spins down after 15 min inactivity, restart ~30s |
| Static Site | Unlimited requests |
| Bandwidth | 100GB/month |
| Build Time | Limited |
| Compute | 0.5 CPU shared |

**What This Means:**
- ✅ Frontend loads quickly (static site)
- ⚠️ Backend may take 30 seconds to start after inactivity
- ✅ No database limit (MongoDB Atlas handles it)
- ✅ Perfect for hobby/learning projects

---

## 🚀 Advanced: Reduce Startup Time

To make backend start faster on free tier:

### Option 1: Use Smaller Model
```env
HF_MODEL_NAME=facebook/blenderbot-400M-distill  # Use this (faster)
# Instead of: facebook/blenderbot-1B-distill   (slower)
```

### Option 2: Pre-Cache Models (Advanced)
Models are cached automatically after first use. The first request will be slow (30-60s), but subsequent requests are fast.

### Option 3: Upgrade (if needed)
For production use, upgrade to Render's paid tier ($7+/month):
- No spin-down (always-on)
- More resources
- Better performance

---

## 🔐 Security Considerations

### ✅ Already Configured
- Non-root Docker user
- Health checks enabled
- Secrets in environment variables
- HTTPS (Render provides free SSL)

### ⚠️ Should Review
- Check MongoDB Atlas network access settings
- Consider IP whitelist for MongoDB
- Regularly update dependencies
- Monitor Render logs for errors

---

## 📊 Monitoring Your Deployment

### On Render Dashboard:
1. Go to your service
2. Click **"Logs"** to view real-time logs
3. Check **"Metrics"** for resource usage
4. Monitor **"Events"** for deployments/errors

### Check Backend Health:
```bash
curl https://mind-buddy-backend.onrender.com/api/health
```

### Access MongoDB:
```bash
# From your local machine, MongoDB Atlas connection string works:
mongosh "mongodb+srv://austin:misaro@cluster1.ynxgjwq.mongodb.net/?appName=Cluster1"
```

---

## 🔄 Auto-Deployment

Your services automatically redeploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render will automatically:
# 1. Detect the push
# 2. Build your Docker image
# 3. Deploy the new version
# 4. Update your service

# Watch deployment in Render dashboard
```

---

## 🐛 Troubleshooting

### Frontend shows 404 or "Cannot reach backend"

**Solution**: Check CORS_ORIGINS in backend environment:
```env
CORS_ORIGINS=https://mind-buddy-frontend.onrender.com
```

### Backend takes too long to start

**Solution**: This is normal on free tier (spin-up from sleep)
- First request after inactivity takes 30-60 seconds
- Subsequent requests are fast
- Use paid tier ($7/month) to avoid spin-down

### MongoDB connection fails

**Solution**: Verify connection string in MONGO_URI:
```env
MONGO_URI=mongodb+srv://austin:misaro@cluster1.ynxgjwq.mongodb.net/?appName=Cluster1
```

Also check MongoDB Atlas:
- Network Access: Allow all IPs (0.0.0.0/0)
- Database Access: Verify austin/misaro credentials

### Build fails with "Out of memory"

**Solution**: This happens on free tier sometimes
- Try reducing model size
- Render will retry automatically
- Consider paid tier if persistent

### Deployment keeps restarting

**Solution**: Check logs for errors:
```bash
# On Render dashboard, click service → Logs
# Look for Python errors or connection issues
```

---

## 🎯 Next Steps

### Week 1: Verification
- [ ] Verify frontend loads
- [ ] Verify backend responds
- [ ] Test authentication
- [ ] Test database operations
- [ ] Monitor logs for errors

### Week 2: Optimization
- [ ] Monitor performance
- [ ] Check database queries
- [ ] Optimize images
- [ ] Test with multiple users

### Month 1: Production Hardening
- [ ] Set up backups
- [ ] Add error monitoring (Sentry)
- [ ] Configure logging
- [ ] Consider paid tier if needed

---

## 📈 When to Upgrade from Free Tier

Consider upgrading to paid tier ($7+/month) when:

- ❌ Backend spin-down causes poor user experience
- ❌ You need always-on service
- ❌ You expect regular traffic
- ❌ You need more compute resources
- ✅ But for hobby/learning → Free tier is perfect!

---

## 💡 Pro Tips

1. **Use Render Crons** for scheduled tasks (in paid tier)
2. **Watch Build Logs** in Render dashboard for optimization ideas
3. **Monitor Resource Usage** - "Metrics" tab shows CPU/Memory
4. **Set Up Alerts** - Render can notify you of failures
5. **Backup MongoDB** - Set up regular backups in MongoDB Atlas

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Flask Deployment**: https://flask.palletsprojects.com/deploying/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **GitHub Workflows**: https://docs.github.com/en/actions

---

## 🎉 You're Deployed!

Your Mind Buddy app is now live on Render! 

- **Frontend**: https://mind-buddy-frontend.onrender.com
- **Backend**: https://mind-buddy-backend.onrender.com
- **Database**: MongoDB Atlas (austin/misaro)

### Next: Monitor and Iterate

1. Watch Render logs for any errors
2. Test with real users
3. Collect feedback
4. Make improvements
5. Deploy with `git push`

**Happy deploying! 🚀**

---

*Last Updated: November 2025*
*For Render.com Free Tier*
