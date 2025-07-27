import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', "postgresql://myuser:mypassword@localhost:5433/ai_clinic_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-jwt-secret')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
