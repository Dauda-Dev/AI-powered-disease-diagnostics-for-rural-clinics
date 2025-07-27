from app import db
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.DateTime, nullable=True)
    email = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='patient')  # Default role is 'patient'
    mobile = db.Column(db.String(255), nullable=True)
    business_id = db.Column(db.Integer, nullable=True)  # Nullable for patients
    role_level = db.Column(db.Integer, nullable=True)  # Nullable for patients
    role_name = db.Column(db.String(50), nullable=True)  # Nullable for patients
    password = db.Column(db.String(255), nullable=False)
    user_status = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class MessageHistory(db.Model):
    __tablename__ = 'message_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # "user" or "ai"
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('messages', lazy=True, cascade='all, delete'))
    
    
class Business(db.Model):
    __tablename__ = 'business'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    business_name = db.Column(db.String(255), nullable=True)
    business_address = db.Column(db.String(255), nullable=True)
    mobile = db.Column(db.String(255), nullable=True)
    business_status = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('businesses', lazy=True))

class BookedAppointment(db.Model):
    __tablename__ = 'booked_appointments'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer,  nullable=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('business.id'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.Text, nullable=True)
    consultation_notes = db.Column(db.Text, nullable=True)  # Notes from the consultation
    status = db.Column(db.String(50), default='pending')  # e.g., pending, confirmed, completed
    ai_recommendation = db.Column(db.Text, nullable=True)  # AI-generated recommendations
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    patient = db.relationship('User', foreign_keys=[patient_id], backref=db.backref('appointments_made', lazy=True))
    hospital = db.relationship('Business', backref=db.backref('booked_appointments', lazy=True))


class HospitalMarker(db.Model):
    __tablename__ = 'hospital_marker'
    id = db.Column(db.Integer, primary_key=True)
    marker_id = db.Column(db.Text, unique=True, nullable= False)
    business_id = db.Column(db.Text, db.ForeignKey('business.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    phone = db.Column(db.Text, nullable=True)
    email = db.Column(db.Text, nullable=True)
    website = db.Column(db.Text, nullable=True)
    address = db.Column(db.Text, nullable=False)
    hours = db.Column(db.Text, nullable=True)
    website = db.Column(db.Text, nullable=True)
    lat = db.Column(db.Text, nullable=False)
    lng = db.Column(db.Text, nullable=False)
    amenity = db.Column(db.Text, nullable=False)
    type = db.Column(db.Text, nullable=False)
    
    # hospital = db.relationship('business', backref=db.backref('hospital_marker', lazy=True))