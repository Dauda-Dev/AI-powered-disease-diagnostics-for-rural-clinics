import os
from llm.groq_llm import consult_rag_llm_groq_with_history, consult_groq_for_recommendations

def diagnose_text(transcript, user_id, api_key=''):

    return consult_rag_llm_groq_with_history(transcript, user_id= user_id, groq_api_key=api_key)


def follow_up_recommendations(user_id, consultation_notes, model_name, patient_name = None, groq_api_key=""):
    
    return consult_groq_for_recommendations(user_id, consultation_notes, patient_name, groq_api_key)