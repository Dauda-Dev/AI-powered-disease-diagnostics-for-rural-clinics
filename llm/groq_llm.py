
import os
import json
import groq
from app.dao.dao_helper import get_recent_messages, save_message


HISTORY_FILE = "history_store/message_history.json"
MAX_HISTORY = 5  # Number of user-bot exchanges to keep


# Ensure the JSON file exists
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)  # Create an empty JSON list

# Load existing history from the file
try:
    with open(HISTORY_FILE, "r") as f:
        MESSAGE_HISTORY = json.load(f)
except json.JSONDecodeError:
    MESSAGE_HISTORY = []  # Reset history if JSON is corrupted


def save_history():
    """Saves the message history to a JSON file."""
    with open(HISTORY_FILE, "w") as f:
        json.dump(MESSAGE_HISTORY, f, indent=4)


def consult_rag_llm_groq_with_history(question, user_id, model_name="llama-3.1-8b-instant", groq_api_key="" ):
    
    groq_client = groq.Client(api_key=groq_api_key)

    history = get_recent_messages(user_id)

    history_text = "\n".join([f"{msg.role}: {msg.content}" for msg in history])

    prompt = f"""
    You are an AI-powered medical assistant for a rural clinic.
    Your task is to provide a **brief diagnosis** based on the user's symptoms and suggest **possible treatments** if applicable.
    Keep responses **concise and clear**, avoiding complex medical terms. Also refer to the user by name if the name is provided.

    <history>
    {history_text}
    </history>

    **Symptoms Provided:** {question}

    **Diagnosis:** [Provide a brief possible diagnosis]  
    **Possible Treatment:** [List treatment options, if any]  
    **Next Steps:** [If necessary, suggest actions like seeing a doctor or self-care measures]
    """

    # Make request to Groq
    response = groq_client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are an AI medical assistant helping rural patients."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5
    )

    answer = response.choices[0].message.content.strip()
  
    save_message(user_id, "user", question)
    save_message(user_id, "ai", answer)
  
    

    return answer


def consult_groq_for_recommendations(user_id, consultation_notes, model_name="llama-3.1-8b-instant", patient_name=None, groq_api_key=""):

    prompt = f"""
    You are a compassionate AI health assistant working with rural clinics.

    Based on the doctor's consultation notes, generate:
    - Follow-up Recommendations
    - Lifestyle Adjustments
    - Recovery Suggestions
    - Suggested Time for Next Check-up

    Keep your language clear and practical, suitable for patients with limited access to hospitals.
    {'The patient\'s name is ' + patient_name + '.' if patient_name else ''}

    <consultation_notes>
    {consultation_notes}
    </consultation_notes>
    """

    groq_client = groq.Client(api_key=groq_api_key)
    
    response = groq_client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a helpful AI medical assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5
    )

    return response.choices[0].message.content.strip()

