import React, { useState } from 'react';
import CalendarMaebrilu from './calendarMaebrilu';
import bookLogo from '../assets/picto/room-key-white.png';
import closeLogo from '../assets/picto/close.png';
import 'react-calendar/dist/Calendar.css';
import '../styles/home.css';

const ChambreList = () => {
  const chambres = [
    'Chambre d\'hôte N°1',
    'Chambre d\'hôte N°2',
    'Chambre d\'hôte N°3',
    'Chambre d\'hôte N°4',
    'La suite',
    'Gite 2/4 Personnes',
    'Gite 2/6 Personnes',
    'Tente lodge 1/2pers',
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

  // État pour stocker la date sélectionnée
  const [selectedDate, setSelectedDate] = useState(null);
  // État pour gérer la visibilité des boutons d'action
  const [showActions, setShowActions] = useState(false);
  const [currentChambre, setCurrentChambre] = useState(null); // Chambre actuelle pour réservation

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
    // Cacher les boutons d'action après réservation ou blocage
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
    <div>
      <div className="chambres-list">
        {chambres.map((chambre, index) => {
          const chambreKey = `chambre${index + 1}`;
          return (
            <div key={chambreKey} className="chambre-section">
              <h3>{chambre}</h3>
              <CalendarMaebrilu
                disabledDates={calendars[chambreKey].disabledDates}
                bookedDates={calendars[chambreKey].bookedDates}
                onDateSelect={(date) => handleDateChange(date)}
                onShowActions={() => handleShowActions(chambreKey)} // Appel à la fonction pour afficher les boutons
              />
            </div>
          );
        })}
      </div>

      {showActions && (
        <div className="actions">
          <button onClick={handleBlockDate} className="close-date-button" aria-label="Bloquer la date">
            <img 
              src={closeLogo} 
              alt="Icône de bloquer" 
              style={{ marginRight: '15px', width: '45px' }} 
            />
          </button>

          <button onClick={handleBookDate} className="book-date-button" aria-label="Réserver la date">
            <img 
              src={bookLogo} 
              alt="Icône de réservation" 
              style={{ marginRight: '15px', width: '45px' }} 
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChambreList;
