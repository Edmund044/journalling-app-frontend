import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const EntryDetailScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/journal/entries/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntry(response.data);
      setLoading(false);
    };
    fetchEntry();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entry && (
        <>
          <Text style={styles.title}>{entry.title}</Text>
          <Text>{entry.content}</Text>
          <Text>Category: {entry.category}</Text>
          <Text>Date: {entry.date}</Text>
          <Button title="Edit" onPress={() => navigation.navigate('EditEntry', { entryId: entry.id })} />
          <br></br>
          <br></br>
          <Button title="Delete" onPress={async () => {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${config.API_URL}/journal/entries/${entryId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            navigation.goBack();
          }} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default EntryDetailScreen;
