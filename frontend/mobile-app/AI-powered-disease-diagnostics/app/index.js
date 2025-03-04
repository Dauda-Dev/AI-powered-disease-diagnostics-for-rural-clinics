// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Animated, Easing } from 'react-native';
// import { Audio } from 'expo-av';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
//
// export default function VoiceChatScreen() {
//   const [recording, setRecording] = useState(null);
//   const [status, setStatus] = useState('Tap to Speak');
//   const [messages, setMessages] = useState([]);
//   const [pulseAnim] = useState(new Animated.Value(1));
//   const [permissionResponse, requestPermission] = Audio.usePermissions();
//
//   async function startRecording() {
//     try {
//       if (permissionResponse.status !== 'granted') {
//         await requestPermission();
//       }
//
//       await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
//       const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//       setRecording(recording);
//       setStatus('Listening...');
//       animatePulse();
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   }
//
//   async function stopRecording() {
//     setStatus('Transcribing...');
//     await recording.stopAndUnloadAsync();
//     await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
//     const uri = recording.getURI();
//     setRecording(null);
//
//     sendAudioToServer(uri);
//   }
//
//   async function sendAudioToServer(audioUri) {
//     try {
//       const formData = new FormData();
//       formData.append('file', { uri: audioUri, name: 'audio.wav', type: 'audio/wav' });
//       console.log("collecting data")
//       const response = await axios.post('http://192.168.146.215:5000/transcribe', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//
//
//       await new Promise(resolve => {
//         displayMessage('You', response.data.transcript);
//         setTimeout(resolve, 5000); // Small delay to ensure UI updates before continuing
//       });
//
//       // Now show the AI's response
//       displayMessage('Dokitor', response.data.diagnosis);
//       setStatus('Tap to Speak')
//     } catch (error) {
//       console.error('Error sending audio:', error);
//       setStatus('Please repeat');
//     }
//   }
//
//   function displayMessage(sender, text) {
//     setMessages(prevMessages => [...prevMessages, { sender, text, words: [], index: 0 }]);
//     animateText(text);
//   }
//
//   function animatePulse() {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, easing: Easing.ease, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true })
//       ])
//     ).start();
//   }
//
//   function animateText(text) {
//     const words = text.split(' ');
//     let index = 0;
//     const interval = setInterval(() => {
//       setMessages(prevMessages => {
//         const updatedMessages = [...prevMessages];
//         const lastMessage = updatedMessages[updatedMessages.length - 1];
//         if (index < words.length) {
//           lastMessage.words.push(words[index]);
//           lastMessage.index = index;
//           index++;
//         } else {
//           clearInterval(interval);
//         }
//         return updatedMessages;
//       });
//     }, 200);
//   }
//
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Text style={item.sender === 'You' ? styles.userText : styles.aiText}>
//             <Text style={styles.sender}>{item.sender}: </Text>
//             {item.words.join(' ')}
//           </Text>
//         )}
//       />
//        <TouchableOpacity
//         style={styles.speakButton}
//         onPress={recording ? stopRecording : startRecording}
//       >
//         <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//           <Ionicons name={recording ? 'mic-off' : 'mic'} size={40} color="white" />
//         </Animated.View>
//       </TouchableOpacity>
//       <Text style={styles.status}>{status}</Text>
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
//   // speakButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ff5252', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
//   // status: { color: 'white', fontSize: 18, marginTop: 10 },
//   userText: { color: 'lightblue', fontSize: 16, marginVertical: 5, alignSelf: 'flex-end' },
//   aiText: { color: 'white', fontSize: 16, marginVertical: 5, alignSelf: 'flex-start' },
//   sender: { fontWeight: 'bold', color: '#ff5252' },
//   speakButton: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#ff5252', justifyContent: 'center', alignItems: 'center', marginVertical: 20, shadowColor: 'red', shadowOpacity: 0.5, shadowRadius: 10 },
//   status: { color: 'white', fontSize: 18, marginTop: 10 },
// });
//




import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function VoiceChatScreen() {
  const [recording, setRecording] = useState(null);
  const [status, setStatus] = useState('Tap to Speak');
  const [messages, setMessages] = useState([]);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Pulse Animation Instance
  const pulseAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, easing: Easing.ease, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true })
    ])
  );

  function startPulse() {
    pulseAnimation.start();
  }

  function stopPulse() {
    pulseAnimation.stop();
    pulseAnim.setValue(1); // Reset animation scale
  }

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        await requestPermission();
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setStatus('Listening...');
      startPulse(); // Start pulse animation
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setStatus('Transcribing...');
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = recording.getURI();
    setRecording(null);

    sendAudioToServer(uri);
  }

  async function sendAudioToServer(audioUri) {
    try {
      const formData = new FormData();
      formData.append('file', { uri: audioUri, name: 'audio.wav', type: 'audio/wav' });
      console.log("Sending audio to server...");

      const response = await axios.post('http://192.168.146.215:5000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await new Promise(resolve => {
        stopPulse(); // Stop pulse animation
        displayMessage('You', response.data.transcript);
        setTimeout(resolve, 5000);
      });

      displayMessage('Dokitor', response.data.diagnosis);
      setStatus('Tap to Speak');
    } catch (error) {
      console.error('Error sending audio:', error);
      stopPulse(); // Stop pulse animation
      setStatus('Please repeat');
    }
  }

  function displayMessage(sender, text) {
    setMessages(prevMessages => [...prevMessages, { sender, text, words: [], index: 0 }]);
    animateText(text);
  }

  function animateText(text) {
    const words = text.split(' ');
    let index = 0;
    const interval = setInterval(() => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (index < words.length) {
          lastMessage.words.push(words[index]);
          lastMessage.index = index;
          index++;
        } else {
          clearInterval(interval);
        }
        return updatedMessages;
      });
    }, 200);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={item.sender === 'You' ? styles.userText : styles.aiText}>
            <Text style={styles.sender}>{item.sender}: </Text>
            {item.words.join(' ')}
          </Text>
        )}
      />
      <TouchableOpacity
        style={styles.speakButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons name={recording ? 'mic-off' : 'mic'} size={40} color="white" />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  userText: { color: 'lightblue', fontSize: 16, marginVertical: 5, alignSelf: 'flex-end' },
  aiText: { color: 'white', fontSize: 16, marginVertical: 5, alignSelf: 'flex-start' },
  sender: { fontWeight: 'bold', color: '#ff5252' },
  speakButton: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#ff5252', justifyContent: 'center', alignItems: 'center', marginVertical: 20, shadowColor: 'red', shadowOpacity: 0.5, shadowRadius: 10 },
  status: { color: 'white', fontSize: 18, marginTop: 10 },
});

