
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import checkForUpdates from '../../components/CheckForUpdates';
import renderLanguageModal from '../../components/LanguageModal';
import api from '../../utils/api';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '@/utils/url';

export default function VoiceChatScreen() {

  const [recording, setRecording] = useState(null);
  const [status, setStatus] = useState('Tap to Speak');
  const [messages, setMessages] = useState([]);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [isTextInput, setIsTextInput] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [selectedLanguage, setSelectedLanguage] = useState({name:'english', code: 'en'});
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const navigation = useNavigation();

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
    sendAudioToServer(uri, selectedLanguage.code);
  }

  async function sendAudioToServer(audioUri, language) {
    try {
       const formData = new FormData();
      formData.append('file', { uri: audioUri, name: 'audio.wav', type: 'audio/wav' });
      formData.append('language', language);
      console.log("Sending audio to server...");
      // const response = {
      //   data: {
      //     transcript: 'fever, cold sweats and a lot of headache',
      //     diagnosis: 'You should see a doctor immediately!'
      //   }


       const response = await api.post(`${BASE_URL}/api/v1/chat/transcribe`, formData, {
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
        setStatus('Error occurred. Please try again.');
        displayMessage('Dokitor', 'Sorry, I couldn’t understand that. Can you try again?');
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

  async function sendTextMessage() {
    if (textInput.trim() === '') return;
    try{
      displayMessage('You', textInput);
      setTextInput('');
    const response = await api.post(`${BASE_URL}/api/v1/chat/recommendations`, {
      textInput
    },);
    await new Promise(resolve => {

  displayMessage('Dokitor', response.data.diagnosis);
       })
    } catch (error) {
        console.error('Error sending message:', error);
        displayMessage('Dokitor', 'Sorry, I couldn’t understand that. Can you try again?');
    }
  }

  return (
    <View style={styles.container}>
      {renderLanguageModal(isLanguageModalVisible, selectedLanguage, setSelectedLanguage, setLanguageModalVisible)}

      <View style={styles.header}>
      {/* <TouchableOpacity style={styles.today}
      onPress={() => navigation.navigate('AppointmentScreen')}>
        <Ionicons name='chevron-back-outline' size={30.0} color='#0F52BA'  />
        </TouchableOpacity> */}
     
        <TouchableOpacity style={styles.addButton} 
        onPress={() => navigation.navigate('HospitalSelection')}>
          <Text style={styles.addButtonText}>+ New Appointment</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.header}>
        <View style={styles.centerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Dokitor</Text>
        </View>
        <View style={{ marginLeft: 'auto', marginRight: 4}}>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
      </View> */}
      {/* <TouchableOpacity
  onPress={() => setIsLanguageModalVisible(true)}
  style={{ padding: 5, backgroundColor: '#eee', borderRadius: 5, marginTop: 10 }}
>
  <Text style={{ fontSize: 14, color: '#113DEE' }}>Language: {language}</Text>
</TouchableOpacity> */}
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
      <TouchableOpacity onPress={() => setIsTextInput(!isTextInput)} style={styles.toggleButton}>*/}
       <Text style={styles.toggleButtonText}>{isTextInput ? 'Use Voice' : 'Use Text'}</Text>
      </TouchableOpacity>

      {!isTextInput && <TouchableOpacity onPress={() => setLanguageModalVisible(true)} style={styles.languageButton}>
       <Text style={styles.languageButtonText}>Language: {selectedLanguage.name}</Text>
      </TouchableOpacity>
}
{/*
      <Text style={styles.status}>{status}</Text> */}
         </View>
   
    </View>
  );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f9fc',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      
      paddingVertical: 20,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderColor: '#e0e0e0',
    },
    centerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      },
    logo: {
      width: 40,
      height: 40,
      marginRight: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#113DEE',
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 15,
      marginVertical: 5,
      maxWidth: '75%',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    userBubble: {
      backgroundColor: '#28A745',
      alignSelf: 'flex-end',
    },
    aiBubble: {
      backgroundColor: '#113DEE',
      alignSelf: 'flex-start',
    },
    messageText: {
      fontSize: 16,
      color: '#fff',
    },
    sender: {
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#ffffffcc',
    },
    buttonContainer: {
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#ffffff',
    },
    speakButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#113DEE',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#113DEE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      marginBottom: 15,
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: '#f1f3f6',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 8,
      alignItems: 'center',
      marginBottom: 10,
      width: '100%',
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#113DEE',
      borderRadius: 20,
      padding: 10,
    },
    status: {
      fontSize: 14,
      color: '#113DEE',
      fontWeight: '600',
      marginTop: 10,
    },
    languageButton: {
      backgroundColor: '#eee',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginTop: 8,
    },
    languageButtonText: {
      fontSize: 14,
      color: '#113DEE',
      fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',

      },
      logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      header: {
        flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 20, marginRight:10,
      },
      date: { color: '#aaa', fontSize: 14 },
      today: { fontSize: 24, fontWeight: 'bold' },
      addButton: { backgroundColor: '#0F52BA', padding: 10, borderRadius: 20 },
      addButtonText: { color: '#fff', fontWeight: 'bold' },
    
  });
  