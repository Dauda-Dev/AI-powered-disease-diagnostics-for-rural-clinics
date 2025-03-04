from flask import Flask, request, Response, jsonify
from flask.cli import load_dotenv
from flask_cors import CORS
from llm.llm_with_history import consult_rag_llm_with_history
import json
import http.client
import os
from llm.rag_llm import consult_rag_llm
from llm.groq_llm import consult_rag_llm_groq_with_history


load_dotenv()
app = Flask(__name__)
CORS(app)

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

@app.route("/diagnose", methods=["POST"])
def diagnose():
    """API endpoint for diagnosing symptoms using LLM"""
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    print("symptoms: ", symptoms)
    def generate_response():
        buffer = ""
        for chunk in consult_rag_llm_with_history(symptoms):
            text = chunk  # Assuming `chunk` is a string
            buffer += text

            # Stream line-by-line when full stop (.) or space is encountered
            while "." in buffer or " " in buffer:
                if "." in buffer:
                    split_index = buffer.index(".") + 1
                else:
                    split_index = buffer.index(" ") + 1

                yield f"data: {buffer[:split_index]}\n\n"
                buffer = buffer[split_index:]  # Keep the remaining text in buffer

    return Response(generate_response(), content_type="text/event-stream")


@app.route("/diagnose/rag-llm", methods=["POST"])
def diagnoseRagLlm():
    """API endpoint for diagnosing symptoms using LLM"""
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    # Get the diagnosis from the RAG-based LLM function
    response_text =consult_rag_llm_groq_with_history(symptoms)

    return jsonify({"diagnosis": response_text})


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    print("transcribing data")
    """API endpoint to receive an audio file and transcribe it using Deepgram"""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Read the audio file as binary data
    audio_data = file.read()

    # Send the audio file to Deepgram API
    transcript = send_to_deepgram(audio_data)

    if not transcript:
        return jsonify({"error": "Failed to transcribe audio"}), 500

    print("transcript: ", transcript)
    # Pass the transcribed text to the diagnosis function
    diagnosis = consult_rag_llm_with_history(transcript)

    print("diagnosis: ", diagnosis)
    return jsonify({"transcript": transcript, "diagnosis": diagnosis})


def send_to_deepgram(audio_data):
    """Sends audio data to Deepgram for transcription"""
    try:
        conn = http.client.HTTPSConnection("api.deepgram.com")

        headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}",
            "Content-Type": "audio/wav",  # Ensure this matches your file format
        }

        conn.request("POST", "/v1/listen", body=audio_data, headers=headers)
        response = conn.getresponse()
        response_data = response.read().decode()

        # Parse the response JSON
        result = json.loads(response_data)
        print(result)
        return result.get("results", {}).get("channels", [{}])[0].get("alternatives", [{}])[0].get("transcript", "")

    except Exception as e:
        print("Error sending audio to Deepgram:", e)
        return None


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)
