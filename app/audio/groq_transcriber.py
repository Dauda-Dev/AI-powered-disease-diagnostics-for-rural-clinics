import base64
import requests  # You need `requests` instead of `http.client`
...

def send_to_whisper_groq(audio_path, api_key, language = "en"):
    try:
        print(api_key)
        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        headers = {
            "Authorization": f"Bearer {api_key}",
        }

        with open(audio_path, "rb") as audio_file:
            files = {
                "file": (audio_path, audio_file, "audio/wav"),
            }
            data = {
                "model": "whisper-large-v3", # or whichever is available
                "language": language
            }

            response = requests.post(url, headers=headers, files=files, data=data)
            response.raise_for_status()
            result = response.json()
            return result.get("text", "")

    except Exception as e:
        print("Error using Whisper via Groq:", e)
        return None
