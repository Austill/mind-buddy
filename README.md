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
| **Database** | SQLite (development), MySQL (production) |
| **Deployment** | **Frontend:** Vercel / **Backend:** Render |

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Make sure you have the following installed on your machine:
- [Git](https://git-scm.com/)
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/en/)
- [MySQL](https://dev.mysql.com/downloads/installer/) (if you want to run with MySQL locally)

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

    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt

    # Create a .env file from the example and add your variables
    # For MySQL, you will need to install an additional driver:
    # pip install mysqlclient
    #
    # Your DATABASE_URL in the .env file should look like this:
    # DATABASE_URL="mysql://user:password@host/db_name"
    cp .env.example .env

    # Run database migrations
    flask db upgrade

    # Start the backend server (usually on http://127.0.0.1:5000)
    flask run
    ```

3.  **Set up the Frontend (React/etc.):**
    ```sh
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Create a .env.local file from the example and add your variables
    # The main variable you'll need is for the backend API URL:
    #
    # VITE_API_BASE_URL=http://127.0.0.1:5000
    cp .env.example .env.local

    # Start the frontend development server (usually on http://localhost:3000)
    npm run dev
    ```

## 🚢 Deployment

This project is structured as a monorepo and is optimized for a split deployment:

- **Frontend**: Deployed on **Vercel**. The root directory in the Vercel project settings is set to `frontend`.
- **Backend**: Deployed on **Render**. The root directory in the Render service settings is set to `backend`. The build command runs `pip install -r requirements.txt` and the start command runs `gunicorn app:app`.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Made with ❤️ by Sereni Crew💡
