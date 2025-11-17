# SereniTree 🌳

A comprehensive mental health and wellness application designed to support users in tracking their emotional well-being, maintaining journals, practicing mindfulness, and accessing crisis support. Powered by AI-driven insights and featuring a conversational assistant named Sereni.

## ✨ Features

### Core Functionality
- **Mood Tracking**: Daily mood logging with emoji-based ratings and trigger identification
- **Journaling**: Private and public journal entries with AI-powered sentiment analysis
- **AI Chat Assistant**: Conversational support with Sereni, an AI companion backed by Groq LLM
- **Meditation Guide**: Guided meditation sessions for mindfulness and relaxation
- **Progress Analytics**: Visual dashboards showing mood trends, streaks, and wellness insights
- **Crisis Support**: Emergency resources and coping strategies

### Premium Features
- **Advanced Analytics**: Detailed progress reports and trend analysis
- **Priority AI Support**: Enhanced AI conversations and personalized insights
- **Export Data**: Download your wellness data for personal records
- **Premium Themes**: Additional customization options

### Technical Features
- **Real-time AI Insights**: Daily wellness recommendations based on your data
- **Secure Authentication**: JWT-based user authentication with encrypted passwords
- **Cross-platform**: Responsive design for desktop and mobile devices
- **Offline-capable**: Core functionality works without internet connection

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Groq API (Llama models)
- **Payments**: Flutterwave integration
- **Deployment**: Render

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Query (TanStack)
- **Routing**: React Router
- **Icons**: Lucide React
- **Deployment**: Vercel

### Development Tools
- **Package Management**: npm (frontend), pip (backend)
- **Version Control**: Git
- **Code Quality**: ESLint, TypeScript
- **Testing**: Basic server tests included

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

### System Requirements
- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **npm**: Latest version
- **Git**: Latest version

### External Services
- **MongoDB Atlas**: Database hosting
- **Groq API**: AI chat functionality (optional for basic features)
- **Flutterwave**: Payment processing (optional for premium features)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd serenitree
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit the .env file with your configuration
notepad backend/.env  # Windows
# or
nano backend/.env     # Linux/macOS
```

**Required Environment Variables:**
```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
LOGGING_LEVEL=DEBUG

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mindbuddy
MONGODB_DB_NAME=mindbuddy

# AI Integration (Groq)
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant

# CORS (Frontend URLs)
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app

# JWT
JWT_SECRET_KEY=your-jwt-secret

# Payments (Optional)
FLW_SECRET_KEY=your-flutterwave-secret
FLW_SIGNATURE_KEY=your-flutterwave-signature
FLW_PLAN_ID=your-plan-id
```

#### Run Backend Server
```bash
# From backend directory
python run.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend  # From backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration (if needed)
The frontend uses environment variables for API endpoints. Create `.env.local` if deploying to different environments:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Run Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📖 Usage

### Getting Started
1. **Register**: Create a new account with email and password
2. **Login**: Access your personalized dashboard
3. **First Mood Check-in**: Start tracking your daily mood
4. **Explore Features**: Try journaling, meditation, or chat with Sereni

### Key Workflows

#### Mood Tracking
- Navigate to "Mood Tracker" in the main menu
- Select your current mood level (1-5 scale)
- Add optional notes and triggers
- View your mood history in the Progress dashboard

#### Journaling
- Go to "Journal" section
- Create new entries with titles and content
- Mark entries as private if desired
- AI will analyze sentiment and provide insights

#### AI Chat (Sereni)
- Click the floating chat widget
- Ask questions or share thoughts
- Receive supportive responses and wellness tips
- Access proactive check-ins for daily wellness

#### Progress Analytics
- Visit "Progress" to see mood trends
- View streaks and achievements
- Get daily AI-generated insights
- Track journal activity and mood patterns

### Premium Features
- Upgrade through the "Premium" section
- Complete payment via integrated Flutterwave
- Access advanced analytics and export options

## 🔌 API Documentation

The backend provides a REST API under `/api/*` endpoints.

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/change-password` - Password change

#### Core Features
- `GET /api/health` - Service health check
- `GET/POST /api/mood` - Mood entries
- `GET/POST /api/journal` - Journal entries
- `POST /api/chat/message` - AI chat messages
- `GET /api/progress` - Progress analytics

#### Premium
- `POST /api/payments/initiate` - Payment initialization
- `GET /api/user/premium-status` - Premium status check

### API Response Format
All responses follow a consistent JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy from the `backend` directory
4. Note the deployed URL for CORS configuration

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set `VITE_API_BASE_URL` to your Render backend URL
3. Deploy from the `frontend` directory
4. Update backend CORS_ORIGINS with the Vercel domain

### Production Checklist
- [ ] Set strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Configure production MongoDB Atlas cluster
- [ ] Set up proper CORS_ORIGINS
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Configure logging level to INFO/WARNING
- [ ] Test all features in production environment

## 🧪 Testing

### Backend Tests
```bash
# From backend directory
python -c "import backend; print('Backend import successful')"
python test_server.py
```

### Frontend Tests
```bash
# From frontend directory
npm run lint
npm run build  # Test production build
```

## 🤝 Contributing

We welcome contributions to SereniTree! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: Use TypeScript, follow ESLint rules
- **Commits**: Use descriptive commit messages
- **Documentation**: Update README for new features

### Areas for Contribution
- UI/UX improvements
- New meditation content
- Additional crisis resources
- Performance optimizations
- Accessibility enhancements
- Internationalization (i18n)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and backend README
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

### Crisis Resources
SereniTree provides access to crisis support resources. In case of emergency:
- **Immediate Help**: Contact local emergency services
- **Hotlines**: National suicide prevention lifeline
- **Professional Help**: Consult licensed mental health professionals

## 🙏 Acknowledgments

- **AI Partner**: Groq for providing fast LLM inference
- **UI Components**: Shadcn/ui for beautiful React components
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS for responsive design
- **Payments**: Flutterwave for secure payment processing

---

**SereniTree** - Nurturing mental wellness, one interaction at a time. 🌱

For detailed backend documentation, see the backend section of this README.
