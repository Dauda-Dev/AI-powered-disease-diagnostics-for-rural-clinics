from flask import Blueprint, request, jsonify
import tempfile
import os
from app.services.transcription_service import transcribe_audio_file
from app.services.diagnosis_service import diagnose_text
from app.utils.jwt_helper import decode_token
import jwt
transcribe_bp = Blueprint('transcribe', __name__, url_prefix='/api/v1/chat')

@transcribe_bp.route('/transcribe', methods=["POST"])
def transcribe_audio():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401
    
    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    language = request.form.get("language")
    api_key = os.getenv("GROQ_API_KEY")

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp:
            file.save(temp)
            audio_path = temp.name
        
        print(f"Transcribing audio file: {audio_path} with language: {language}")    
        transcript = transcribe_audio_file(audio_path, language, api_key=api_key)
        os.remove(audio_path)

        if not transcript:
            return jsonify({"error": "Failed to transcribe audio"}), 500

        diagnosis = diagnose_text(transcript,user_id=user_id, api_key= api_key)
        return jsonify({"transcript": transcript, "diagnosis": diagnosis})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@transcribe_bp.route('/recommendations', methods=["POST"])
def get_AI_doctor_recommendations():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401
    
    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401


    inputText = request.json.get("textInput")
    api_key = os.getenv("GROQ_API_KEY")

    if inputText == "":
        return jsonify({"error": "No input text"}), 400

    try:
      
        diagnosis = diagnose_text(inputText, user_id=user_id, api_key= api_key)
        return jsonify({"diagnosis": diagnosis})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
