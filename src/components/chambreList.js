import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import CalendarMaebrilu from './calendarMaebrilu';
import bookLogo from '../assets/picto/room-key-white.png';
import closeLogo from '../assets/picto/close.png';

const ChambreList = () => {
  const chambres = [
    "Chambre d'hôte N°1",
    "Chambre d'hôte N°2",
    "Chambre d'hôte N°3",
    "Chambre d'hôte N°4",
    "La suite",
    "Gite 2/4 Personnes",
    "Gite 2/6 Personnes",
    "Tente lodge 1/2pers",
  ];

  const [calendars, setCalendars] = useState({
    chambre1: { disabledDates: [], bookedDates: [] },
    chambre2: { disabledDates: [], bookedDates: [] },
    chambre3: { disabledDates: [], bookedDates: [] },
    chambre4: { disabledDates: [], bookedDates: [] },
    chambre5: { disabledDates: [], bookedDates: [] },
    chambre6: { disabledDates: [], bookedDates: [] },
    chambre7: { disabledDates: [], bookedDates: [] },
    chambre8: { disabledDates: [], bookedDates: [] },
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [currentChambre, setCurrentChambre] = useState(null);

  const updateDates = (chambre, type, date) => {
    setCalendars((prevCalendars) => {
      const updatedChambre = { ...prevCalendars[chambre] };
      if (type === 'block') {
        updatedChambre.disabledDates = [...updatedChambre.disabledDates, date];
        updatedChambre.bookedDates = updatedChambre.bookedDates.filter(
          (d) => new Date(d).toDateString() !== new Date(date).toDateString()
        );
      } else if (type === 'book') {
        updatedChambre.bookedDates = [...updatedChambre.bookedDates, date];
        updatedChambre.disabledDates = updatedChambre.disabledDates.filter(
          (d) => new Date(d).toDateString() !== new Date(date).toDateString()
        );
      }
      return { ...prevCalendars, [chambre]: updatedChambre };
    });
    setShowActions(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShowActions = (chambre) => {
    setCurrentChambre(chambre);
    setShowActions(true);
  };

  const handleBlockDate = () => {
    if (currentChambre && selectedDate) {
      updateDates(currentChambre, 'block', selectedDate);
      setSelectedDate(null);
    }
  };

  const handleBookDate = () => {
    if (currentChambre && selectedDate) {
      updateDates(currentChambre, 'book', selectedDate);
      setSelectedDate(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sélectionnez une chambre</Text>
      </View>
      <ScrollView style={styles.chambresSelection}>
        {chambres.map((chambre, index) => {
          const chambreKey = `chambre${index + 1}`;
          return (
            <View key={chambreKey} style={styles.chambreSection}>
              <Text style={styles.chambreTitle}>{chambre}</Text>
              <CalendarMaebrilu
                disabledDates={calendars[chambreKey].disabledDates}
                bookedDates={calendars[chambreKey].bookedDates}
                onDateSelect={(date) => handleDateChange(date)}
                onShowActions={() => handleShowActions(chambreKey)}
              />
            </View>
          );
        })}
      </ScrollView>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleBlockDate} style={styles.closeDateButton} aria-label="Bloquer la date">
            <Image source={closeLogo} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBookDate} style={styles.bookDateButton} aria-label="Réserver la date">
            <Image source={bookLogo} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: 'center',
    backgroundColor: '#fff', // Assurez-vous d'utiliser la couleur appropriée
    width: '100%',
    paddingTop: '6%',
    paddingBottom: '4%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chambresSelection: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: '5%',
    maxHeight: 342,
    overflowY: 'scroll', // Géré par ScrollView
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '7%',
  },
  chambreSection: {
    marginBottom: 10,
  },
  chambreTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  closeDateButton: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  bookDateButton: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  icon: {
    width: 45,
    height: 45,
  },
});

export default ChambreList;
