import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const EntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/journal/entries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(response.data);
      setLoading(false);
    };
    fetchEntries();
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
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.category}</Text>
            <Text>{item.date_created}</Text>
            <Button title="View" onPress={() => navigation.navigate('EntryDetail', { entryId: item.id })} />
          </View>
        )}
      />
      <Button title="Add Entry" onPress={() => navigation.navigate('AddEntry')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  entry: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EntriesScreen;
