import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const EditEntryScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/entries/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const entry = response.data;
      setTitle(entry.title);
      setContent(entry.content);
      setCategory(entry.category);
    };
    fetchEntry();
  }, []);

  const handleEditEntry = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://localhost:5000/entries/${entryId}`, { title, content, category }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to edit entry');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
      />
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Save Changes" onPress={handleEditEntry} />
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

export default EditEntryScreen;
