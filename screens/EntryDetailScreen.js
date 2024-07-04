import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const EntryDetailScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/entries/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntry(response.data);
    };
    fetchEntry();
  }, []);

  return (
    <View style={styles.container}>
      {entry && (
        <>
          <Text style={styles.title}>{entry.title}</Text>
          <Text>{entry.content}</Text>
          <Text>Category: {entry.category}</Text>
          <Text>Date: {entry.date_created}</Text>
          <Button title="Edit" onPress={() => navigation.navigate('EditEntry', { entryId: entry.id })} />
          <Button title="Delete" onPress={async () => {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`http://localhost:5000/entries/${entry.id}`, {
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
