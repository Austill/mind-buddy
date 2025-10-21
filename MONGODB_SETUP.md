# MongoDB Local Setup Guide for Mind Buddy

This guide will help you set up and run the Mind Buddy app locally with MongoDB.

## Prerequisites

1. **MongoDB** - Install MongoDB Community Edition on your system
2. **Python 3.8+** - For the Flask backend
3. **Node.js 16+** - For the frontend

## Step 1: Install MongoDB

### Windows
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and choose "Complete" installation
3. Install as a Windows Service (recommended)
4. MongoDB will run automatically on `localhost:27017`

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## Step 2: Verify MongoDB Installation

Open a terminal/command prompt and run:
```bash
mongosh
```

If MongoDB is running, you should see the MongoDB shell prompt. Type `exit` to leave.

## Step 3: Install Backend Dependencies

Navigate to the backend directory and install Python packages:

```bash
cd backend
pip install -r requirements.txt
```

## Step 4: Environment Configuration

The `.env` file in the `backend` directory is already configured for local MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/mindbuddy
```

You can customize the database name by changing `mindbuddy` to any name you prefer.

## Step 5: Run the Backend

From the project root directory:

```bash
cd backend
python run.py
```

Or using Flask directly:
```bash
cd backend
flask run
```

The backend should start on `http://localhost:5000`

You should see a message indicating successful MongoDB connection:
```
MongoDB connection established successfully
```

## Step 6: Run the Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start on `http://localhost:5173` (or another port if 5173 is busy)

## Step 7: Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`

## Troubleshooting

### MongoDB Connection Failed

**Issue**: "Failed to connect to MongoDB"

**Solutions**:
1. Verify MongoDB is running:
   - Windows: Check Services for "MongoDB Server"
   - macOS/Linux: Run `sudo systemctl status mongod` or `brew services list`

2. Check if MongoDB is listening on port 27017:
   ```bash
   netstat -an | grep 27017
   ```

3. Try connecting with mongosh:
   ```bash
   mongosh mongodb://localhost:27017
   ```

### Port Already in Use

**Issue**: Backend or frontend port is already in use

**Solutions**:
- Backend: Change port in `backend/run.py` or use environment variable:
  ```bash
  export FLASK_RUN_PORT=5001
  flask run
  ```

- Frontend: Vite will automatically try the next available port

### CORS Issues

If you experience CORS errors, verify the `CORS_ORIGINS` in `backend/.env` includes your frontend URL:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

## Database Management

### View Data in MongoDB

Use MongoDB Compass (GUI) or mongosh (CLI):

```bash
mongosh mongodb://localhost:27017/mindbuddy
```

Then:
```javascript
// List all collections
show collections

// View users
db.users.find().pretty()

// View journal entries
db.journal_entries.find().pretty()

// View mood entries
db.mood_entries.find().pretty()
```

### Clear Database

To start fresh:
```bash
mongosh mongodb://localhost:27017/mindbuddy
```

Then:
```javascript
db.dropDatabase()
```

## Development Notes

- The app uses 3 MongoDB collections:
  - `users` - User accounts
  - `journal_entries` - Journal entries
  - `mood_entries` - Mood tracking data

- All models use MongoDB's `ObjectId` for primary keys
- Timestamps are stored as ISO format strings
- Password hashing is handled by Flask-Bcrypt

## Next Steps

1. Create a user account through the frontend
2. Test journal entry creation
3. Test mood tracking
4. Verify data persistence in MongoDB

For production deployment, you'll need to:
- Use a production MongoDB instance (MongoDB Atlas recommended)
- Update `MONGO_URI` in environment configuration
- Set proper CORS origins
- Use a production-grade WSGI server (already configured with gunicorn)
