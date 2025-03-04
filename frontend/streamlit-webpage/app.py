'''import streamlit as st
## import speech_recognition as sr
import os
from datetime import datetime
import tempfile
## from gtts import gTTS
import base64

# Page configuration
st.set_page_config(
    page_title="Voice Assistant App",
    page_icon="🎙️",
    layout="wide"
)

# Apply custom CSS
st.markdown("""
<style>
    .main {
        padding: 1.5rem;
        background-color: #f8f9fa;
    }
    .stButton>button {
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        border-radius: 10px;
        padding: 0.5rem 1rem;
        border: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s;
    }
    .stButton>button:hover {
        background-color: #45a049;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .clear-btn>button {
        background-color: #f44336;
    }
    .clear-btn>button:hover {
        background-color: #d32f2f;
    }
    .download-btn>button {
        background-color: #2196F3;
    }
    .download-btn>button:hover {
        background-color: #1976D2;
    }
    .speech-history-container {
        background-color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-top: 1rem;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
    }
    .listening-indicator {
        color: #f44336;
        font-weight: bold;
        animation: blink 1s infinite;
    }
    @keyframes blink {
        0% {opacity: 1;}
        50% {opacity: 0.5;}
        100% {opacity: 1;}
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if "speech_history" not in st.session_state:
    st.session_state.speech_history = ""
if "is_listening" not in st.session_state:
    st.session_state.is_listening = False
if "audio_file" not in st.session_state:
    st.session_state.audio_file = None

# Function to create an autoplay audio from bytes
def autoplay_audio(audio_bytes):
    audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
    audio_tag = f'<audio autoplay="true" src="data:audio/mp3;base64,{audio_base64}"></audio>'
    st.markdown(audio_tag, unsafe_allow_html=True)

# Function to get a download link for text
def get_text_download_link(text, filename, link_text):
    b64 = base64.b64encode(text.encode()).decode()
    href = f'<a href="data:file/txt;base64,{b64}" download="{filename}" style="text-decoration:none;">📥 {link_text}</a>'
    return href

# Function to recognize speech
def recognize_speech():
    st.session_state.is_listening = True
    recognizer = sr.Recognizer()
    
    # Configure recognition parameters
    recognizer.energy_threshold = 300  # Adjust based on your microphone sensitivity
    recognizer.dynamic_energy_threshold = True
    recognizer.pause_threshold = 0.8  # Shorter pause threshold for better response
    
    with sr.Microphone() as source:
        # Reduce ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=1)
        
        try:
            placeholder = st.empty()
            placeholder.markdown('<p class="listening-indicator">🎤 Listening... Speak now!</p>', unsafe_allow_html=True)
            
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=15)
            placeholder.empty()
            
            text = recognizer.recognize_google(audio)
            st.session_state.is_listening = False
            return text, audio
        except sr.UnknownValueError:
            st.session_state.is_listening = False
            return "Could not understand audio", None
        except sr.RequestError:
            st.session_state.is_listening = False
            return "Error connecting to Google Speech Recognition", None
        except Exception as e:
            st.session_state.is_listening = False
            return f"Error: {str(e)}", None

# Function for text-to-speech
def text_to_speech(text):
    try:
        tts = gTTS(text=text, lang='en')
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
            temp_file = fp.name
            tts.save(temp_file)
            
            with open(temp_file, "rb") as audio_file:
                audio_bytes = audio_file.read()
                st.session_state.audio_file = audio_bytes
                
            # Clean up the temp file
            os.unlink(temp_file)
            
            return audio_bytes
    except Exception as e:
        st.error(f"Error generating speech: {str(e)}")
        return None

# Main app layout
st.title("🎙️ Voice Assistant App")

# Create columns for layout
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📝 Speech-to-Text")
    
    # Button to capture speech
    if st.button("🎤 Start Listening", disabled=st.session_state.is_listening):
        recognized_text, audio_data = recognize_speech()
        
        if recognized_text and recognized_text != "Could not understand audio" and not recognized_text.startswith("Error"):
            if st.session_state.speech_history:
                st.session_state.speech_history += " " + recognized_text
            else:
                st.session_state.speech_history = recognized_text
                
            st.success(f"Recognized: {recognized_text}")
        elif recognized_text:
            st.warning(recognized_text)
    
    # Display stored speech history
    st.markdown("### Current Transcript:")
    speech_container = st.container()
    with speech_container:
        st.markdown('<div class="speech-history-container">' + 
                   (st.session_state.speech_history if st.session_state.speech_history else "No speech recorded yet.") + 
                   '</div>', unsafe_allow_html=True)
    
    # Edit text area for manual corrections
    st.subheader("✏️ Edit Transcript")
    edited_text = st.text_area("", value=st.session_state.speech_history, height=150)
    
    if edited_text != st.session_state.speech_history:
        if st.button("Update Transcript"):
            st.session_state.speech_history = edited_text
            st.success("Transcript updated!")

with col2:
    st.subheader("🔊 Text-to-Speech")
    
    if st.button("🔊 Speak Text"):
        if st.session_state.speech_history:
            with st.spinner("Generating speech..."):
                audio_bytes = text_to_speech(st.session_state.speech_history)
                if audio_bytes:
                    autoplay_audio(audio_bytes)
                    st.success("Speech generated!")
        else:
            st.warning("Please record some speech first.")
    
    # Playback last recording if available
    if st.session_state.audio_file:
        st.audio(st.session_state.audio_file)
    
    st.subheader("💾 Save/Load")
    
    # Save text to file
    if st.session_state.speech_history:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"speech_transcript_{timestamp}.txt"
        st.markdown(get_text_download_link(st.session_state.speech_history, filename, "Download Transcript"), unsafe_allow_html=True)
    
    # Load text from file
    uploaded_file = st.file_uploader("Upload transcript file", type=['txt'])
    if uploaded_file is not None:
        stringio = uploaded_file.getvalue().decode("utf-8")
        if st.button("Load Uploaded Text"):
            st.session_state.speech_history = stringio
            st.success("Text loaded successfully!")

# Button row at the bottom
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown('<div class="clear-btn">', unsafe_allow_html=True)
    if st.button("🗑️ Clear All"):
        st.session_state.speech_history = ""
        st.session_state.audio_file = None
        st.success("All content cleared.")
    st.markdown('</div>', unsafe_allow_html=True)

with col3:
    st.markdown('<div class="download-btn">', unsafe_allow_html=True)
    if st.button("💾 Save Session"):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        session_info = f"Voice Assistant Session - {timestamp}\n\n{st.session_state.speech_history}"
        st.markdown(get_text_download_link(session_info, f"voice_session_{timestamp}.txt", "Download Session Data"), unsafe_allow_html=True)
        st.success("Session ready for download!")
    st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("Built with Streamlit and Python 🐍")'''