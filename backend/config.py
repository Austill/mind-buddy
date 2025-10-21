import os
import logging
from dotenv import load_dotenv

# Load environment variables from a .env file at the project root
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

class Config:
    """Base configuration settings."""
    SECRET_KEY = os.getenv("SECRET_KEY", "a-very-secret-key-for-dev")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/mindbuddy")
    # Allow CORS from your Vercel frontend and local dev
    # The string is split by commas in __init__.py
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://mb-frontend-rho.vercel.app,http://localhost:8080"
    )

    # Logging configuration
    LOGGING_LEVEL = os.getenv("LOGGING_LEVEL", "DEBUG")
    LOGGING_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
