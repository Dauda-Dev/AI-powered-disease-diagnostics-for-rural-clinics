import streamlit as st
from PIL import Image

st.image("logo.jpeg", width=50)
st.header("Dokitor")

st.title("AI Symptom Diagnosis")
st.write("Dokitor provides fast and reliable AI-powered symptom checks, ensuring healthcare is always within reach")
history_prompt = st.text_input("State your medical history")
symptoms_prompt = st.text_input("Describe your symptoms")
st.button("Submit")

st.markdown("""
<style>
    body {
        align-content: center;
        text-align:center;
        margin:auto;
    }
    .stButton>button {
         background-color: #113DEE;
        color: white;
        font-weight: bold;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        border: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .stButton>button:hover {
        background-color: white;
        color: #113DEE;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .stButton>button:onclick {
        background-color: #113DEE;
        color: white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .stHeading {
        color: #113DEE;
    }
</style>
 """, unsafe_allow_html=True)