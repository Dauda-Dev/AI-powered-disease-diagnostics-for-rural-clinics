
from app.audio.groq_transcriber import send_to_whisper_groq

def transcribe_audio_file(audio_path, language, api_key=''):
   
    return send_to_whisper_groq(audio_path, api_key, language)
