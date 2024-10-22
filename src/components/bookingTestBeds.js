import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const chambresMapping = {
  'Room 1': '526903',
  'Room 2': '527098',
  'Room 3': '527099',
  'Room 4': '527100',
  'Room 5': '527101',
  'Room 6': '527102',
  'Room 7': '527103',
  'Room 8': '527104',
  'General': '527105'
};

const BookingList = ({ onFetchBookings }) => {
  const [bookings, setBookings] = useState([]);
  const API_KEY = process.env.REACT_APP_BEDS24_API_KEY;
  const PROP_KEY = process.env.REACT_APP_BEDS24_PROP_KEY;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post('http://localhost:3001/proxy/getBookings', {
          authentication: {
            apiKey: API_KEY,
            propKey: PROP_KEY,
          }
        });

        if (Array.isArray(response.data)) {
          setBookings(response.data);
          onFetchBookings(response.data); // Call the callback with bookings
        } else {
          console.error("Les données reçues ne sont pas un tableau", response.data);
          setBookings([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
      }
    };

    fetchBookings();
  }, [onFetchBookings]);

  // Fonction pour obtenir le nom de la chambre à partir de son ID
  const getRoomNameById = (roomId) => {
    const roomNames = Object.keys(chambresMapping);
    for (const name of roomNames) {
      if (chambresMapping[name] === roomId) {
        return name; // Retourne le nom de la chambre correspondant à l'ID
      }
    }
    return 'Chambre inconnue'; // Valeur par défaut si l'ID n'est pas trouvé
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Réservations</Text>
      <ScrollView>
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <View key={booking.bookId} style={styles.bookingItem}>
              <Text style={styles.roomId}>Chambre ID: {booking.roomId}</Text>
              <Text style={styles.roomName}>Nom de la chambre: {getRoomNameById(booking.roomId)}</Text>
              <Text>Dates: {booking.firstNight} au {booking.lastNight}</Text>
              <Text>Nombre d'Adultes: {booking.numAdult}</Text>
              <Text>Statut: {booking.status}</Text>
            </View>
          ))
        ) : (
          <Text>Aucune réservation trouvée.</Text>
        )}
      </ScrollView>
    </View>
  );
};


export default BookingList;
