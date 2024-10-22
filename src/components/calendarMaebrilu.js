import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendarMaebrilu.css';

const CalendarMaebrilu = ({ selectedDate, onDateChange, disabledDates, bookedDates }) => {
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isDisabled = disabledDates.some(d => d.toDateString() === date.toDateString());
      const isBooked = bookedDates.some(d => d.toDateString() === date.toDateString());

      if (isDisabled) return 'disabled-date';
      if (isBooked) return 'booked-date';
    }
    return '';
  };

  return (
    <Calendar
      onChange={onDateChange}
      value={selectedDate}
      tileClassName={getTileClassName}
    />
  );
};

export default CalendarMaebrilu;
