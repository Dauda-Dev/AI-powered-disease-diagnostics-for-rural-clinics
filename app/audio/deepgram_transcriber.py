
def send_to_deepgram(audio_data, DEEPGRAM_API_KEY):
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
