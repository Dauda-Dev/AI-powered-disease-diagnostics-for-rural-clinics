from flask import Blueprint, request, jsonify
import tempfile
import os
from app.services.transcription_service import transcribe_audio_file
from app.services.diagnosis_service import diagnose_text
from app.utils.jwt_helper import decode_token
from app.models import Business, BookedAppointment, User
import jwt
from app.services.diagnosis_service import consult_groq_for_recommendations
from app import db
import datetime
from app.services.business_service import get_business_info, book_appointment_service, get_appointments, get_appointments_mapped

hospital_bp = Blueprint('hospital', __name__, url_prefix='/api/v1/hospital')

@hospital_bp.route('/info', methods=["GET"])
def get_hospital_info():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401
    
    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
        role = payload['role']
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    
    businesslist = get_business_info()
    return jsonify(businesslist), 200

@hospital_bp.route('/appointment/book', methods=["POST"])
def book_appointment():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401
    
    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
        role = payload['role']
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    
    data = request.json
    appointment_date = data.get('date')
    appointment_time = data.get('time')
    consultType = data.get('consultType')
    hospital_id = data.get('hospitalId')
    register_patient = data.get('registerPatient', False)
    
    if not appointment_date or not hospital_id or not appointment_time or not consultType:
        return jsonify({'error': 'Appointment date and business ID are required'}), 400
    appointmentDateTime = f"{appointment_date} {appointment_time}"
    print(f'patient_id: {user_id}, hospital_id: {hospital_id}, appointment_date: {appointmentDateTime}, reason: {consultType}')
    
    booking = book_appointment_service(patient_id=user_id, doctor_id=None, hospital_id=hospital_id, appointment_date=appointmentDateTime, reason=consultType)
    
    # Here you would typically save the appointment to the database
    # For now, we just return a success message
    return jsonify({'message': 'Appointment booked successfully', 'appointment_id': booking.id, 'patient_id' : user_id, 'business_id': hospital_id, 'appointment_date': booking.appointment_date}), 200
        
    
    
    
    
@hospital_bp.route('/appointments', methods=['GET'])
def fetch_appointments():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401
    
    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
        role = payload['role']
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    
    if role == "hospital":
        user = User.query.get(user_id)
        business = Business.query.filter_by(id=user.business_id).first()
        if not business:
            return jsonify({'error': 'Hospital not found'}), 404
        try:
            appointments = get_appointments(hospital_id=business.id)
            result = get_appointments_mapped(appointments)

            return jsonify({'appointments': result}), 200
            
        except Exception as e:
            print("Error:", e)
            return jsonify({'error': 'Failed to retrieve appointments'}), 500
        
    if role == "patient":
 
        patient_id = request.args.get('patientId', type=int)
        hospital_id = request.args.get('hospitalId', type=int)

        try:
            appointments = get_appointments(patient_id=patient_id, hospital_id=hospital_id)
            result = get_appointments_mapped(appointments)

            return jsonify({'appointments': result}), 200

        except Exception as e:
            print("Error:", e)
            return jsonify({'error': 'Failed to retrieve appointments'}), 500
        
    return jsonify({'error': 'Unauthorized access'}), 403


@hospital_bp.route('/appointments/<int:appointment_id>/assign', methods=['PUT'])
def assign_staff_to_appointment(appointment_id):
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401

    try:
        payload = decode_token(token)
        user_role = payload['role']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

    data = request.get_json()
    staff_id = data.get('staff_id')

    if not staff_id:
        return jsonify({'error': 'Staff ID is required'}), 400

    # Fetch appointment from DB
    appointment = BookedAppointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404

    # Update appointment with assigned staff and confirm status
    appointment.doctor_id = staff_id
    appointment.status = 'Confirmed'  # or 'Approved' depending on your logic

    db.session.commit()

    return jsonify({
        'message': 'Staff assigned and appointment confirmed',
        'appointment_id': appointment.id,
        'staff_id': staff_id,
        'status': appointment.status
    }), 200



@hospital_bp.route('/appointments/<int:appointment_id>/complete', methods=['PUT'])
def complete_appointment(appointment_id):
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401

    try:
        payload = decode_token(token)
        user_id = payload['user_id']
        role = payload['role']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

    data = request.get_json()
    consultation_notes = data.get('notes')

    if not consultation_notes:
        return jsonify({'error': 'Consultation notes are required'}), 400

    # Fetch the appointment
    appointment = BookedAppointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    if appointment.status == 'Completed':
        return jsonify({'error': 'Appointment Already completed'}), 404

    # Update appointment
    appointment.consultation_notes = consultation_notes
    appointment.status = 'Completed'


    db.session.commit()

    return jsonify({
        'message': 'Appointment marked as completed',
        'appointment_id': appointment.id,
        'status': appointment.status,
        'consultation_notes': appointment.consultation_notes
    }), 200


@hospital_bp.route('/appointments/process-ai-recommendations', methods=['POST'])
def process_ai_recommendations():
    # Expect API key for Groq in request JSON or headers
    data = request.json or {}
    user_id = data.get('user_id')
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        return jsonify({'error': 'groq_api_key is required'}), 400

    appointments = BookedAppointment.query.filter(
        BookedAppointment.patient_id == user_id,
        BookedAppointment.status == 'Completed',
        BookedAppointment.consultation_notes.isnot(None),
        BookedAppointment.ai_recommendation.is_(None)
    ).all()

    if not appointments:
        return jsonify({'message': 'No completed appointments to process'}), 200

    processed_appointments = []

    for appt in appointments:
        patient = User.query.get(appt.patient_id)
        patient_name = f'{patient.first_name} {patient.last_name}' if patient and patient.first_name else None

        recommendation = consult_groq_for_recommendations(
            user_id=appt.patient_id,
            consultation_notes=appt.consultation_notes,
            patient_name=patient_name,
            groq_api_key=groq_api_key
        )
        
        appt.ai_recommendation = recommendation
        db.session.commit()

        # Broadcast recommendation asynchronously via websocket
        data_to_broadcast = {
            "type": "followup_recommendation",
            "appointment_id": appt.id,
            "recommendation": recommendation
        }
        # asyncio.run(broadcast_recommendation(data_to_broadcast))

        processed_appointments.append({
            'appointment_id': appt.id,
            'recommendation': recommendation
        })

    return jsonify({
        'message': f'Processed {len(processed_appointments)} appointments',
        'results': processed_appointments
    }), 200