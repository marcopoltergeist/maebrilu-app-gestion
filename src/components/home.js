import React, { useState, useEffect } from 'react';
import { getBookings } from '../api/beds24Service';  // Assurez-vous d'importer le fichier API correctement
import axios from 'axios'; // Import Axios for API calls


import BookingList from './bookingTestBeds';


import logoMaebrilu from '../assets/picto/picto-maebrilu.png';
import chambreHote from '../assets/picto/chambre-hote.png';
import suite from '../assets/picto/suite.png';
import gite from '../assets/picto/gite.png';
import tente from '../assets/picto/tente.png';
import CalendarMaebrilu from './calendarMaebrilu';
import bookLogo from '../assets/picto/room-key-white.png';
import closeLogo from '../assets/picto/close.png';
import '../styles/home.css';
import '../styles/chambreList.css';
import '../styles/calendarMaebrilu.css'; // Ajout des styles de calendrier


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
  const [selectedChambre, setSelectedChambre] = useState('chambre1'); // Par défaut, chambre1 est sélectionnée
  const [selectedDate, setSelectedDate] = useState(null); // Date actuellement sélectionnée
  const [showActions, setShowActions] = useState(false); // État pour afficher ou non les boutons d'actions
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
        try {
            const data = await getBookings();
            handleFetchBookings(data); // Passez les réservations à la fonction pour mettre à jour les dates
        } catch (error) {
            console.error("Erreur lors de la récupération des réservations", error);
        }
    };

    fetchBookings();
}, []);


  // État des dates pour chaque chambre
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

 // Send data to the API when booking or blocking a date
 const sendDateAction = async (roomId, dates, actionType) => {
  const reservationObject = {
    roomId: roomId,   // Room ID (selectedChambre)
    dates: dates,     // Array of dates (selectedDate or multiple)
    action: actionType // 'book' or 'block'
  };

  try {
    // POST request to the API
    const response = await axios.post('http://localhost:3001/proxy/sendBooking', reservationObject);
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error sending data to API:', error);
  }
};

const handleFetchBookings = (bookings) => {
  bookings.forEach(booking => {
      const chambreName = booking.roomName; // Assurez-vous que roomName est le bon champ
      const roomId = chambresMapping[chambreName]; // Obtenez l'ID de chambre correspondant
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




  // Fonction de sélection de la chambre
  const handleSelectChambre = (chambre) => {
    setSelectedChambre(chambre);
    setShowActions(false); // Masquer les actions si on change de chambre
  };

  // Fonction de sélection de la date dans le calendrier
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowActions(true); // Afficher les boutons d'actions lorsqu'une date est sélectionnée
  };

  // Fonction de blocage de la date sélectionnée
  const handleBlockDate = () => {
    const chambreDates = dates[selectedChambre];
  
    // Vérifier si la date est déjà bloquée
    if (!chambreDates.disabled.some(d => d.toDateString() === selectedDate.toDateString())) {
      chambreDates.disabled.push(selectedDate);
      setDates({ ...dates, [selectedChambre]: chambreDates });
    }

    if (selectedChambre && selectedDate) {
      // Send block request to API
      sendDateAction(selectedChambre, [selectedDate], 'block');
      setSelectedDate(null);  // Clear the selected date after action
    }

    {/** 


    if (selectedDate) {
      const chambreDates = dates[selectedChambre];
  
      // Vérifier si la date est déjà bloquée
      if (!chambreDates.disabled.some(d => d.toDateString() === selectedDate.toDateString())) {
        chambreDates.disabled.push(selectedDate);
        setDates({ ...dates, [selectedChambre]: chambreDates });
  
        // Créer l'objet final avec le nom de la chambre et les dates
        const chambreObj = {
          chambre: selectedChambre,
          booked: chambreDates.booked,
          disabled: chambreDates.disabled,
        };
  
        console.log(chambreObj); // Afficher l'objet dans la console
      }
    }
    */}
  };

  // Fonction de réservation de la date sélectionnée
  const handleBookDate = () => {
    const chambreDates = dates[selectedChambre];


    if (!chambreDates.booked.some(d => d.toDateString() === selectedDate.toDateString())) {
      chambreDates.booked.push(selectedDate);
      setDates({ ...dates, [selectedChambre]: chambreDates });
    }

    if (selectedChambre && selectedDate) {
      // Send booking request to API
      sendDateAction(selectedChambre, [selectedDate], 'book');
      setSelectedDate(null);  // Clear the selected date after action
    }

 

    {/**
    if (selectedDate) {
      const chambreDates = dates[selectedChambre];
  
      // Vérifier si la date est déjà réservée
      if (!chambreDates.booked.some(d => d.toDateString() === selectedDate.toDateString())) {
        chambreDates.booked.push(selectedDate);
        setDates({ ...dates, [selectedChambre]: chambreDates });
  
        // Créer l'objet final avec le nom de la chambre et les dates
        const chambreObj = {
          chambre: selectedChambre,
          booked: chambreDates.booked,
          disabled: chambreDates.disabled,
        };
  
        console.log(chambreObj); // Afficher l'objet dans la console
      }
    }
     */}
  };

  // Fonction pour afficher la liste des chambres et cacher les actions
  const handleChambreHeaderClick = () => {
    setShowActions(false); // Masquer les actions
  };

  return (
    <div className="home-container">

<div className="booking-list" >
<BookingList onFetchBookings={handleFetchBookings} /> {/* Pass the handler here */}
</div>


      <div className="chambre-header" onClick={handleChambreHeaderClick}>
        {selectedChambre && (
          <div className="chambre-info">
            <img
              src={getIconForChambre(selectedChambre)}
              alt={`Icone pour ${selectedChambre}`}
              style={{ marginRight: '15px', width: '45px' }}
            />
            <h2>
              {selectedChambre === 'chambre1' && "Chambre d'hôte N°1"}
              {selectedChambre === 'chambre2' && "Chambre d'hôte N°2"}
              {selectedChambre === 'chambre3' && "Chambre d'hôte N°3"}
              {selectedChambre === 'chambre4' && "Chambre d'hôte N°4"}
              {selectedChambre === 'suite' && "La suite"}
              {selectedChambre === 'gite24' && "Gite 2/4 Personnes"}
              {selectedChambre === 'gite26' && "Gite 2/6 Personnes"}
              {selectedChambre === 'tente' && "La tente"}
              {selectedChambre === 'general' && "Maebrilu Général"}
            </h2>
          </div>
        )}
      </div>

      {/* Calendrier de la chambre sélectionnée */}
      <div className='div-calendar-container'>
        <CalendarMaebrilu
          disabledDates={dates[selectedChambre].disabled}
          bookedDates={dates[selectedChambre].booked}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Boutons d'actions qui apparaissent uniquement quand une date est sélectionnée */}
      {showActions && (
        <>
          <div className="actions">
            <button onClick={handleBlockDate} className="close-date-button">
              <img src={closeLogo} alt="Bloquer" style={{ width: '20px' }} />
              Bloquer
            </button>
            <button onClick={handleBookDate} className="book-date-button">
              <img src={bookLogo} alt="Réserver" style={{ width: '20px' }} />
              Réserver
            </button>
          </div>
        </>
      )}

      {/* Liste des chambres qui s'affiche uniquement si les actions ne sont pas visibles */}
      {!showActions && (
        <div className="chambres-selection">
          {['general', 'chambre1', 'chambre2', 'chambre3', 'chambre4', 'suite', 'gite24', 'gite26', 'tente'].map(chambre => (
            <button
              key={chambre}
              className={selectedChambre === chambre ? 'active' : ''}
              onClick={() => handleSelectChambre(chambre)}
            >
              <img
                src={getIconForChambre(chambre)}
                alt={chambre}
                style={{ marginRight: '15px', width: '45px' }}
              />
              {chambre === 'general' ? "Maebrilu Général" : `Chambre d'hôte N°${chambre.charAt(chambre.length - 1)}`}
            </button>
          ))}
        </div>
      )}
             <h4>18 Octobre 2024</h4>
        <div>
          <p>réservation</p>
          <p>Paul Dubor</p>
          <p>Infos réservation</p>
        </div>
    </div>
  );
};

export default Home;
