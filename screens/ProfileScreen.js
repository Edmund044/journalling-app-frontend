import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {profile && (
        <>
          <Text style={styles.label}>Username: {profile.username}</Text>
          <Text style={styles.label}>Email: {profile.email}</Text>
          <Button title="View Entries" onPress={() => navigation.navigate('Entries')} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProfileScreen;
