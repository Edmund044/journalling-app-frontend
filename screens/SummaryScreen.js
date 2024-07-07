import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SummaryScreen = () => {
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState(null);
    const [period, setPeriod] = useState('weekly');
  
    useEffect(() => {
      fetchSummaryData();
    }, []);
  
    const fetchSummaryData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${config.API_URL}/journal/summary?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        setSummaryData(response.data);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to  fetch summary data');
        setLoading(false);
      }
    };
  
    const handleFetchSummary = () => {
      setLoading(true);
      fetchSummaryData();
    };
  
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Summary Data</Text>
        <Text style={styles.label}>Select Schedule:</Text>
      <Picker
        selectedValue={period}
        style={styles.picker}
        onValueChange={(itemValue) => setPeriod(itemValue)}
      >
        <Picker.Item label="Select an option..." value="" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>
      <Text style={styles.periods}>Selected: {period}</Text>
        <Button title="Fetch Summary" onPress={handleFetchSummary} />
        {summaryData ? (
          <>
            {/* Render your summary data here 
            
                    'period': period,
        'start_date': start_date.strftime('%Y-%m-%d'),
        'end_date': end_date.strftime('%Y-%m-%d'),
        'total_entries': len(entries),
            */}
            <Text>Period : {JSON.stringify(summaryData.period)}</Text>
            <Text>Start date : {JSON.stringify(summaryData.start_date)}</Text>
            <Text>End date : {JSON.stringify(summaryData.end_date)}</Text>
            <Text>Total Entries : {JSON.stringify(summaryData.total_entries)}</Text>
          </>
        ) : (
          <Text>No summary data available</Text>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    datePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    label: {
      marginRight: 10,
      fontSize: 18,
    },
    datePicker: {
      width: 200,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    periods: {
        marginTop: 20,
        fontSize: 16,
      },
  });


export default SummaryScreen;  