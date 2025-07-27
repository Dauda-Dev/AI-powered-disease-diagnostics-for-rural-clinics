from app.models import BookedAppointment, User
from app import db
from app.services.diagnosis_service import consult_groq_for_recommendations
import asyncio
import json

# Import broadcast from websocket server
from app.websocket_server import broadcast_recommendation

def process_completed_appointments(groq_api_key):
    print("Processing completed appointments for AI recommendations...")
    appointments = BookedAppointment.query.filter(
        BookedAppointment.status == 'Completed',
        BookedAppointment.consultation_notes != None,
        BookedAppointment.ai_recommendation == None
    ).all()
    print(f"Found {len(appointments)} completed appointments to process.")

    # for appt in appointments:
    #     patient = User.query.get(appt.patient_id)
    #     recommendation = consult_groq_for_recommendations(
    #         user_id=appt.patient_id,
    #         consultation_notes=appt.consultation_notes,
    #         patient_name=f'{patient.first_name} {patient.last_name}' if patient and patient.first_name else None,
    #         groq_api_key=groq_api_key
    #     )
    #     appt.ai_recommendation = recommendation
    #     db.session.commit()

        # Send to frontend via WebSocket
    print('Sending recommendation...')
    data = {
            "type": "followup_recommendation",
            "appointment_id": 'appt.id',
            "recommendation": 'recommendation'
        }
    asyncio.run(broadcast_recommendation(data))
    print('Done')
