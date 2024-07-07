import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const EditProfileScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchprofile = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/journal/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profile = response.data;
      setEmail(profile.email);
      setUsername(profile.username);
    };
    fetchprofile();
  }, []);

  const handleEditprofile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${config.API_URL}/journal/profile`, { email, username, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to edit profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Save Changes" onPress={handleEditprofile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default EditProfileScreen;
