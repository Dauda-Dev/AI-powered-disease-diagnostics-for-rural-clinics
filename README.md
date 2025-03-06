# AI-Powered Disease Diagnosis System

This project is an AI-powered disease diagnosis system designed to help clinics in rural areas provide medical diagnoses based on symptoms. The system supports both voice and text input, making it accessible for users with different language preferences.

## Setup Instructions

### Backend Setup
1. Clone the repository:  
   ```sh
   git clone <repository-url>
   cd <project-folder>
   ```
2. Install the required dependencies:  
   ```sh
   pip install -r requirements.txt
   ```
3. Create an `.env` file in the project root and add your API keys:  
   ```sh
   DEEPGRAM_API_KEY=your_deepgram_api_key
   GROQ_API_KEY=your_groq_api_key
   ```
4. Run the backend server:  
   ```sh
   python app.py
   ```

### Mobile App Setup
1. Navigate to the mobile app folder:  
   ```sh
   cd mobile-app
   ```
2. Install Expo:  
   ```sh
   npm install expo
   ```
3. Install dependencies:  
   ```sh
   npm install
   ```
4. Create an `.env` file in the `mobile-app` directory and add your API keys:
   ```sh
   DEEPGRAM_API_KEY=your_deepgram_api_key
   GROQ_API_KEY=your_groq_api_key
   ```
5. Start the app using Expo:  
   ```sh
   npx expo start
   ```
6. Use the **Expo Go** app on your phone or run the app on an emulator.

## Features
- Voice and text-based symptom input
- AI-powered diagnosis using Groq and Deepgram
- Support for multiple languages
- Accessible for rural clinics

## License
This project is open-source. Feel free to contribute!

