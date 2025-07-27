import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (employee: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
  }) => void;
}

const AddEmployeeModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('Nurse');

  const handleSubmit = () => {
    if (!firstname || !lastname || !email || !password || !mobile || !role) return;
    onSubmit({ firstname, lastname, email, password, mobile, role });
    onClose();

    // Clear form
    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
    setMobile('');
    setRole('Nurse');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Employee</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={Platform.OS === 'ios' ? styles.pickerIOS : undefined}
            >
              <Picker.Item label="Nurse" value="Nurse" />
              <Picker.Item label="Doctor" value="Doctor" />
              <Picker.Item label="Receptionist" value="Receptionist" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Add Employee</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddEmployeeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pickerIOS: {
    height: 150,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
