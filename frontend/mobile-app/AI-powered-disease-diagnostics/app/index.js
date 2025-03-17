//
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
// import { Audio } from 'expo-av';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import checkForUpdates from '../components/CheckForUpdates'
//
// export default function VoiceChatScreen() {
//   const [recording, setRecording] = useState(null);
//   const [status, setStatus] = useState('Tap to Speak');
//   const [messages, setMessages] = useState([]);
//   const [pulseAnim] = useState(new Animated.Value(1));
//   const [permissionResponse, requestPermission] = Audio.usePermissions();
//
//   useEffect(() => {
//     checkForUpdates();
//   }, []);
//
//
//   // Pulse Animation Instance
//   const pulseAnimation = Animated.loop(
//     Animated.sequence([
//       Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, easing: Easing.ease, useNativeDriver: true }),
//       Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true })
//     ])
//   );
//
//   function startPulse() {
//     pulseAnimation.start();
//   }
//
//   function stopPulse() {
//     pulseAnimation.stop();
//     pulseAnim.setValue(1); // Reset animation scale
//   }
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
//       startPulse(); // Start pulse animation
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   }
//
//   async function stopRecording() {
//     if (!recording) return;
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
//       console.log("Sending audio to server...");
//
//       // const response = await axios.post('https://api.swiftplugs.com/api/v1/audio/transcribe', formData, {
//       //   headers: { 'Content-Type': 'multipart/form-data' }
//       // });
//       const response = {
//         "data":{
//           "transcript": "fever, cold sweats and alot of head ache",
//           "diagnosis": "a whole lot of cred bro, your done just pack up youer stuff and take the exit, stage left, you're cooked bro...dont even tell your mans"
//         }
//       }
//
//       await new Promise(resolve => {
//         stopPulse(); // Stop pulse animation
//         displayMessage('You', response.data.transcript);
//         setTimeout(resolve, 5000);
//       });
//
//       displayMessage('Dokitor', response.data.diagnosis);
//       setStatus('Tap to Speak');
//     } catch (error) {
//       console.error('Error sending audio:', error);
//       stopPulse(); // Stop pulse animation
//       setStatus('Please repeat');
//     }
//   }
//
//   function displayMessage(sender, text) {
//     setMessages(prevMessages => [...prevMessages, { sender, text, words: [], index: 0 }]);
//     animateText(text);
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
//       <View style={styles.header}>
//       <Image source={require('../assets/images/logo.png')} style={styles.logo} />
//       <Text style={styles.title}>Dokitor</Text>
//       </View>
//       <Text style={styles.describe}>
//         AI Powered Diagnosis
//       </Text>
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={{ flexGrow: 1 }}
//         /*ListHeaderComponent={() => (  // Add title above FlatList
//           <View style={styles.header}>
//             <Image source={require('../assets/images/logo.png')} style={styles.logo} />
//             <Text style={styles.title}>Dokitor</Text>
//           </View>
//         )}*/
//         renderItem={({ item }) => (
//           <Text style={item.sender === 'You' ? styles.userText : styles.aiText}>
//             <Text style={styles.sender}>{item.sender}: </Text>
//             {item.words.join(' ')}
//           </Text>
//         )}
//       />
//       <TouchableOpacity
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
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cdefee' },
//   userText: { color: 'lightblue', fontSize: 16, marginVertical: 5, alignSelf: 'flex-end' },
//   aiText: { color: 'white', fontSize: 16, marginVertical: 5, alignSelf: 'flex-start' },
//   sender: { fontWeight: 'bold', color: '#05346a' },
//   speakButton: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#113DEE', justifyContent: 'center', alignItems: 'center', marginVertical: 20, shadowColor: 'blue', shadowOpacity: 0.5, shadowRadius: 10 },
//   status: { color: 'white', fontSize: 18, marginTop: 10 },
//   header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 50,},
//   title: { color: '#113DEE',  fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, },
//   describe: { fontSize: 16, alignSelf: "center", }
// });
//

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import checkForUpdates from '../components/CheckForUpdates';

export default function VoiceChatScreen() {
  const [recording, setRecording] = useState(null);
  const [status, setStatus] = useState('Tap to Speak');
  const [messages, setMessages] = useState([]);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [isTextInput, setIsTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const flatListRef = React.useRef();

  useEffect(() => {
  if (messages.length > 0) {
    flatListRef.current?.scrollToEnd({ animated: true });
  }
}, [messages]);

  useEffect(() => {
    checkForUpdates();
  }, []);

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
    pulseAnim.setValue(1);
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
      startPulse();
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
      // const response = {
      //   data: {
      //     transcript: 'fever, cold sweats and a lot of headache',
      //     diagnosis: 'You should see a doctor immediately!'
      //   }


       const response = await axios.post('https://api.swiftplugs.com/api/v1/audio/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
       await new Promise(resolve => {

      stopPulse();
      displayMessage('You', response.data.transcript);
      setTimeout(() => displayMessage('Dokitor', response.data.diagnosis), 2000);
      setStatus('Tap to Speak');
       })
    } catch (error) {
      console.error('Error sending audio:', error);
      stopPulse();
      setStatus('Please repeat');
    }
  }

  function displayMessage(sender, text) {
    const words = text.split(' ');
    let index = 0;
    setMessages(prevMessages => [...prevMessages, { sender, words: [], index }]);
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

  function sendTextMessage() {
    if (textInput.trim() === '') return;
    displayMessage('You', textInput);
    setTextInput('');
    setTimeout(() => displayMessage('Dokitor', 'Thanks for your input! Processing...'), 2000);
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Dokitor</Text>
      </View>
      <View style={styles.chatContainer}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'You' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.sender}>{item.sender}: </Text>
            <Text style={styles.messageText}>{item.words.join(' ')}</Text>
          </View>
        )}
      />
      </View>
      <View style={styles.buttonContainer}>
      {isTextInput ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={sendTextMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.speakButton} onPress={recording ? stopRecording : startRecording}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name={recording ? 'mic-off' : 'mic'} size={40} color="white" />
          </Animated.View>
        </TouchableOpacity>
      )}
      {/*<TouchableOpacity onPress={() => setIsTextInput(!isTextInput)} style={styles.toggleButton}>*/}
      {/*  <Text style={styles.toggleButtonText}>{isTextInput ? 'Use Voice' : 'Use Text'}</Text>*/}
      {/*</TouchableOpacity>*/}
         <Text style={styles.status}>{status}</Text>
         </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1,
    // justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#ffffff' },
  chatContainer: {flex: 1, justifyContent: 'space-between', backgroundColor: '#ffffff'},
  header: { flexDirection: 'row',justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 20 },
  buttonContainer: {flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 5},
  title: { color: '#113DEE', fontSize: 30, fontWeight: 'bold', textAlign: 'center' },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  userBubble: { backgroundColor: '#28A745', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-start' },
  messageText: { color: 'white', fontSize: 16 },
  sender: { fontWeight: 'bold', color: '#fff' },
  speakButton: { width: 85, height: 85, borderRadius: 45, backgroundColor: '#113DEE', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  toggleButton: { marginVertical: 10, padding: 10, backgroundColor: '#113DEE', borderRadius: 5 },
  toggleButtonText: { color: 'white', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  textInput: { flex: 1, borderBottomWidth: 1, borderColor: '#ccc', padding: 5, marginRight: 10 },
  sendButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  status: { marginTop: 0, color: '#113DEE', fontSize: 15, fontWeight: 'bold' },
});
