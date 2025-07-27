import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
const languages = [
    {name:'english', code: 'en'}, 
    {name:'yoruba', code: 'yo'},  
    {name: 'hausa', code: 'ha'}, 
    {name:'igbo', code: 'ig'}, 
    {name:'french', code: 'fr'}];

export default renderLanguageModal = (isLanguageModalVisible, selectedLanguage, setSelectedLanguage, setLanguageModalVisible) => (
  isLanguageModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select Language</Text>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageOption}
            onPress={() => {
              setSelectedLanguage(lang);
              setLanguageModalVisible(false);
            }}
          >
            <Text style={[styles.languageText, selectedLanguage === lang && styles.selectedLanguage]}>
              {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setLanguageModalVisible(false)} style={styles.closeModalButton}>
          <Text style={styles.closeModalText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      languageOption: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
      },
      languageText: {
        fontSize: 16,
        color: '#333',
      },
      selectedLanguage: {
        fontWeight: 'bold',
        color: '#113DEE',
      },
      closeModalButton: {
        marginTop: 20,
        backgroundColor: '#113DEE',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      closeModalText: {
        color: 'white',
        fontWeight: 'bold',
      },
      languageButton: {
        backgroundColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
      },
      languageButtonText: {
        color: '#333',
        fontWeight: 'bold',
      },
})
