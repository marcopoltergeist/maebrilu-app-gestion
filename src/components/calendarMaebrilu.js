import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import 'react-native-gesture-handler';

const CalendarMaebrilu = ({ selectedDate, onDateChange, disabledDates, bookedDates }) => {
  
  const getTileClassName = (date) => {
    const dateString = date.dateString; 
    const isDisabled = disabledDates.some(d => d.toDateString() === new Date(dateString).toDateString());
    const isBooked = bookedDates.some(d => d.toDateString() === new Date(dateString).toDateString());

    if (isDisabled) return 'disabled-date';
    if (isBooked) return 'booked-date';
    return '';
  };

  const renderDay = (day) => {
    const tileClass = getTileClassName(day);
    return (
      <View style={[styles.tile, tileClass === 'disabled-date' && styles.disabledDate, tileClass === 'booked-date' && styles.bookedDate]}>
        <Text>{day.dateString}</Text>
      </View>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={(day) => onDateChange(day.dateString)}
        markedDates={{
          ...disabledDates.reduce((acc, date) => {
            acc[date.toISOString().split('T')[0]] = { disabled: true }; // format YYYY-MM-DD
            return acc;
          }, {}),
          ...bookedDates.reduce((acc, date) => {
            acc[date.toISOString().split('T')[0]] = { marked: true, dotColor: 'red' }; // example
            return acc;
          }, {}),
        }}
        renderDay={renderDay}
        theme={{
          selectedDayBackgroundColor: '#FFCC00', 
          todayTextColor: '#00adf5', 
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          arrowColor: '#FFCC00',
          monthTextColor: '#00adf5',
          indicatorColor: '#00adf5',
          textDayFontFamily: 'Outfit',
          textMonthFontFamily: 'Outfit',
          textDayHeaderFontFamily: 'Outfit',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
  },
  disabledDate: {
    backgroundColor: 'gray',
    color: 'white',
  },
  bookedDate: {
    backgroundColor: 'darkblue',
    color: 'white',
  },
});

export default CalendarMaebrilu;
