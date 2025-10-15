# Mind Buddy 🧠✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=mind-buddy-ten)](https://mind-buddy-ten.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.2.2-000000?logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)

> Your AI-powered companion for mental wellness and productivity.

**Mind Buddy** is a full-stack web application designed to help users track their mood, journal their thoughts, and gain insights through an interactive AI chat interface.

---

### ▶️ Live Demo

[**[your-live-mind-buddy-app](https://mind-buddy-ten.vercel.app/)**]

---

![Mind Buddy Screenshot](mind-buddy.png)

## 🌟 Features

- **AI Chat**: Engage with an intelligent chatbot for support and guidance.
- **Journaling**: A secure and private space to write down your thoughts.
- **Mood Tracking**: Log your daily mood to visualize trends over time.
- **User Authentication**: Secure sign-up and login functionality.
- **Responsive Design**: A seamless experience on both desktop and mobile devices.

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | JavaScript, React (or your framework), CSS |
| **Backend** | Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS |
| **Database** | MongoDB (local/development), MongoDB Atlas (production) |
| **Deployment** | **Frontend:** Vercel / **Backend:** Render |

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Make sure you have the following installed on your machine:
- [Git](https://git-scm.com/)
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community) (required for local development)

📋 **For detailed MongoDB setup instructions, see [MONGODB_SETUP.md](MONGODB_SETUP.md)**

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Sereni-Crew/mind-buddy.git
    cd mind-buddy
    ```

2.  **Set up the Backend (Flask):**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Create and activate a virtual environment (optional but recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt

    # The .env file is already configured for local MongoDB
    # Default connection: mongodb://localhost:27017/mindbuddy
    # You can modify MONGO_URI in backend/.env if needed

    # Start the backend server (usually on http://127.0.0.1:5000)
    python run.py
    # Or use Flask directly:
    flask run
    ```

    **Note**: MongoDB does not require migrations like SQL databases. Collections are created automatically when first used.

3.  **Set up the Frontend (React):**
    ```sh
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Configure the backend API URL if needed
    # Check frontend/.env.local or create one with:
    # VITE_API_BASE_URL=http://127.0.0.1:5000

    # Start the frontend development server (usually on http://localhost:5173)
    npm run dev
    ```

4.  **Access the Application:**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:5000
    - API Health Check: http://localhost:5000/api/health

## 🚢 Deployment

This project is structured as a monorepo and is optimized for a split deployment:

- **Frontend**: Deployed on **Vercel**. The root directory in the Vercel project settings is set to `frontend`.
- **Backend**: Deployed on **Render**. The root directory in the Render service settings is set to `backend`. The build command runs `pip install -r requirements.txt` and the start command runs `gunicorn app:app`.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Made with ❤️ by Sereni Crew💡
