import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getBookings } from '../api/beds24Service'; 
import axios from 'axios'; 

import BookingList from './bookingTestBeds'; 
import CalendarMaebrilu from './calendarMaebrilu'; 
import logoMaebrilu from '../assets/picto/picto-maebrilu.png';
import chambreHote from '../assets/picto/chambre-hote.png';
import suite from '../assets/picto/suite.png';
import gite from '../assets/picto/gite.png';
import tente from '../assets/picto/tente.png';
import bookLogo from '../assets/picto/room-key-white.png';
import closeLogo from '../assets/picto/close.png';

const getIconForChambre = (chambre) => {
  if (['chambre1', 'chambre2', 'chambre3', 'chambre4'].includes(chambre)) {
    return chambreHote;
  } else if (chambre === 'suite') {
    return suite;
  } else if (['gite24', 'gite26'].includes(chambre)) {
    return gite;
  } else if (chambre === 'tente') {
    return tente;
  } else if (chambre === 'general') {
    return logoMaebrilu;
  }
};

const Home = () => {
  const [selectedChambre, setSelectedChambre] = useState('chambre1');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [dates, setDates] = useState({
    chambre1: { disabled: [], booked: [] },
    chambre2: { disabled: [], booked: [] },
    chambre3: { disabled: [], booked: [] },
    chambre4: { disabled: [], booked: [] },
    suite: { disabled: [], booked: [] },
    gite24: { disabled: [], booked: [] },
    gite26: { disabled: [], booked: [] },
    tente: { disabled: [], booked: [] },
    general: { disabled: [], booked: [] },
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        handleFetchBookings(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
    };
    fetchBookings();
  }, []);

  const chambresMapping = {
    'Room 1': '526903',
    'Room 2': '527098',
    'Room 3': '527099',
    'Room 4': '527100',
    'Room 5': '527101',
    'Room 6': '527102',
    'Room 7': '527103',
    'Room 8': '527104',
    'Genral': '527105'
  };

  const sendDateAction = async (roomId, dates, actionType) => {
    const reservationObject = {
      roomId: roomId,
      dates: dates,
      action: actionType
    };

    try {
      const response = await axios.post('http://localhost:3001/proxy/sendBooking', reservationObject);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  const handleFetchBookings = (bookings) => {
    bookings.forEach(booking => {
      const chambreName = booking.roomName;
      const roomId = chambresMapping[chambreName];
      const firstNight = new Date(booking.firstNight);
      const lastNight = new Date(booking.lastNight);

      if (roomId) {
        const dateArray = [];
        for (let d = new Date(firstNight); d <= lastNight; d.setDate(d.getDate() + 1)) {
          dateArray.push(new Date(d));
        }

        setDates(prevDates => ({
          ...prevDates,
          [roomId]: {
            ...prevDates[roomId],
            disabled: [...prevDates[roomId].disabled, ...dateArray],
          },
        }));
      } else {
        console.error(`Chambre ${chambreName} non trouvée dans la correspondance.`);
      }
    });
  };

  const handleSelectChambre = (chambre) => {
    setSelectedChambre(chambre);
    setShowActions(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowActions(true);
  };

  const handleBlockDate = () => {
    const chambreDates = dates[selectedChambre];
  
    if (!chambreDates.disabled.some(d => d.toDateString() === selectedDate.toDateString())) {
      chambreDates.disabled.push(selectedDate);
      setDates({ ...dates, [selectedChambre]: chambreDates });
    }

    if (selectedChambre && selectedDate) {
      sendDateAction(selectedChambre, [selectedDate], 'block');
      setSelectedDate(null);
    }
  };

  const handleBookDate = () => {
    const chambreDates = dates[selectedChambre];

    if (!chambreDates.booked.some(d => d.toDateString() === selectedDate.toDateString())) {
      chambreDates.booked.push(selectedDate);
      setDates({ ...dates, [selectedChambre]: chambreDates });
    }

    if (selectedChambre && selectedDate) {
      sendDateAction(selectedChambre, [selectedDate], 'book');
      setSelectedDate(null);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.chambreHeader}>
        {selectedChambre && (
          <View style={styles.chambreInfo}>
            <Image
              source={getIconForChambre(selectedChambre)}
              style={styles.chambreIcon}
            />
            <Text style={styles.chambreText}>
              {selectedChambre === 'chambre1' && "Chambre d'hôte N°1"}
              {selectedChambre === 'chambre2' && "Chambre d'hôte N°2"}
              {selectedChambre === 'chambre3' && "Chambre d'hôte N°3"}
              {selectedChambre === 'chambre4' && "Chambre d'hôte N°4"}
              {selectedChambre === 'suite' && "La suite"}
              {selectedChambre === 'gite24' && "Gite 2/4 Personnes"}
              {selectedChambre === 'gite26' && "Gite 2/6 Personnes"}
              {selectedChambre === 'tente' && "La tente"}
              {selectedChambre === 'general' && "Maebrilu Général"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.calendarContainer}>
        <CalendarMaebrilu
          disabledDates={dates[selectedChambre].disabled}
          bookedDates={dates[selectedChambre].booked}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleBlockDate} style={styles.actionButton}>
            <Image source={closeLogo} style={styles.icon} />
            <Text>Bloquer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookDate} style={styles.actionButton}>
            <Image source={bookLogo} style={styles.icon} />
            <Text>Réserver</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showActions && (
        <View style={styles.chambresSelection}>
          {['general', 'chambre1', 'chambre2', 'chambre3', 'chambre4', 'suite', 'gite24', 'gite26', 'tente'].map(chambre => (
            <TouchableOpacity
              key={chambre}
              onPress={() => handleSelectChambre(chambre)}
              style={styles.chambreButton}
            >
              <Image source={getIconForChambre(chambre)} style={styles.chambreIconSmall} />
              <Text>
                {chambre === 'general' ? "Maebrilu Général" : `Chambre d'hôte N°${chambre.charAt(chambre.length - 1)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bookingList: {
    overflow: 'scroll', 
    height: '40%', 
  },
});

export default Home;