from app.models import Business, BookedAppointment, User
from app import db

def get_business_info():
    """
    Fetches all business information from the database.
    
    Returns:
        List of dictionaries containing business details.
    """
    businesses = Business.query.all()
    
    business_list = []
    for b in businesses:
        business_list.append({
            'id': b.id,
            'business_name': b.business_name,
            'business_address': b.business_address,
            'mobile': b.mobile,
            'user_id': b.user_id,
            'business_status': b.business_status
        })
    
    return business_list

def book_appointment_service(patient_id, doctor_id, hospital_id, appointment_date, reason):
    
    """
    Books an appointment for a patient with a doctor at a specific hospital.
    
    Args:
        patient_id (int): ID of the patient.
        doctor_id (int): ID of the doctor.
        hospital_id (int): ID of the hospital.
        appointment_date (datetime): Date and time of the appointment.
        reason (str): Reason for the appointment.
    
    Returns:
        dict: Confirmation details of the booked appointment.
    """
    business = Business.query.get(hospital_id)
    if not business:
        return {'error': 'Hospital not found'}, 404
    new_appointment = BookedAppointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        hospital_id=hospital_id,
        appointment_date=appointment_date,
        reason=reason,
        status='pending'  # Default status
    )
    
    db.session.add(new_appointment)
    db.session.commit()
    return new_appointment




def get_appointments(patient_id=None, hospital_id=None):
    query = BookedAppointment.query

    if patient_id:
        query = query.filter_by(patient_id=patient_id)
    if hospital_id:
        query = query.filter_by(hospital_id=hospital_id)

    appointments = query.order_by(BookedAppointment.created_at.desc()).all()
    return appointments

def get_appointments_mapped(appointments):
    result = []
    for appt in appointments:
        if appt.doctor_id:
            doctor = User.query.get(appt.doctor_id)
            if doctor.first_name:
                result.append({
                        'id': appt.id,
                        'patient_id': appt.patient_id,
                        'ai_recommendation' : appt.ai_recommendation,
                        'patient_name': f"{appt.patient.first_name} {appt.patient.last_name}" if appt.patient else None,
                        'hospital_id': appt.hospital_id,
                        'hospital_name': appt.hospital.business_name if appt.hospital else None,
                        'appointment_date': appt.appointment_date,
                        'hospital_address': appt.hospital.business_address if appt.hospital else None,
                        "hospital_mobile": appt.hospital.mobile if appt.hospital else None,
                        "patient_mobile": appt.patient.mobile if appt.patient else None,
                        'reason': appt.reason,
                        'assigned_staff_id': appt.doctor_id,
                        'doctor_name': f"{doctor.first_name} {doctor.last_name}" if doctor else None,
                        'doctor_mobile': doctor.mobile if doctor else None,
                        'doctor_email': doctor.email if doctor else None,
                        'status': appt.status,
                        'created_at': appt.created_at.isoformat()
                        
                    })
            else:
                result.append({
                'id': appt.id,
                'patient_id': appt.patient_id,
                'patient_name': f"{appt.patient.first_name} {appt.patient.last_name}" if appt.patient else None,
                'hospital_id': appt.hospital_id,
                'hospital_name': appt.hospital.business_name if appt.hospital else None,
                'appointment_date': appt.appointment_date,
                'hospital_address': appt.hospital.business_address if appt.hospital else None,
                "hospital_mobile": appt.hospital.mobile if appt.hospital else None,
                "patient_mobile": appt.patient.mobile if appt.patient else None,
                'reason': appt.reason,
                'status': appt.status,
                'created_at': appt.created_at.isoformat()
            })
        else:
            doctor = None
            # If no doctor is assigned, we still want to return the appointment details
            # but without doctor-specific information.
            result.append({
                'id': appt.id,
                'patient_id': appt.patient_id,
                'patient_name': f"{appt.patient.first_name} {appt.patient.last_name}" if appt.patient else None,
                'hospital_id': appt.hospital_id,
                'hospital_name': appt.hospital.business_name if appt.hospital else None,
                'appointment_date': appt.appointment_date,
                'hospital_address': appt.hospital.business_address if appt.hospital else None,
                "hospital_mobile": appt.hospital.mobile if appt.hospital else None,
                "patient_mobile": appt.patient.mobile if appt.patient else None,
                'reason': appt.reason,
                'status': appt.status,
                'created_at': appt.created_at.isoformat()
            })
    return result

