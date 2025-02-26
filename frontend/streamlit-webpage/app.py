import streamlit as st
import speech_recognition as sr

# Initialize session state for storing concatenated speech text
if "speech_history" not in st.session_state:
    st.session_state.speech_history = ""

st.title("🎙️ Speech-to-Text App")


# Function to recognize speech
def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.write("Listening... Speak now!")
        try:
            audio = recognizer.listen(source, timeout=5)  # Adjust timeout if needed
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError:
            return "Error connecting to Google Speech Recognition"


# Button to capture speech
if st.button("Start Listening"):
    recognized_text = recognize_speech()

    if recognized_text:
        # Concatenate new speech with previous history
        st.session_state.speech_history += ". " + recognized_text + " "
        st.write(f"You said: {recognized_text}")


if st.button("Clear Speech History"):
    st.session_state.speech_history = ""
    st.write("Speech history cleared.")

# Display stored speech history
st.subheader("📝 Speech History:")
st.write(st.session_state.speech_history)


