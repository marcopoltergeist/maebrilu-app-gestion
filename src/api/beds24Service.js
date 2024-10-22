import axios from 'axios';

// Configuration de l'API Beds24
const BEDS24_API_URL = 'http://localhost:3001/proxy/getBookings';

// Assurez-vous que ces valeurs sont définies dans votre fichier .env
const API_KEY = process.env.REACT_APP_BEDS24_API_KEY; // Votre clé API
const PROP_KEY = process.env.REACT_APP_BEDS24_PROP_KEY; // Votre clé de propriété

// Fonction pour obtenir les réservations
export const getBookings = async () => {
    try {
        const response = await axios.post(BEDS24_API_URL, {
            authentication: {
                apiKey: API_KEY,
                propKey: PROP_KEY,
            },
            //roomId: "526903",  // Optionnel
            //bookId: "12345678", // Optionnel
            //arrivalFrom: "YYYYMMDD", // Optionnel
            //arrivalTo: "YYYYMMDD", // Optionnel
            //departureFrom: "YYYYMMDD", // Optionnel
            //departureTo: "YYYYMMDD", // Optionnel
            // modifiedSince: "YYYYMMDD HH:mm:ss", // Optionnel
            //includeInvoice: false, // Optionnel
            //includeInfoItems: false, // Optionnel
            // Structure JSON pour les paramètres de la requête
            status: '1', // Exemple : obtenir uniquement les réservations confirmées
            limit: '100', // Limite du nombre de réservations à retourner
            offset: '0',  // Pour la pagination
        });
        return response.data; // Retourne les données reçues
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        throw error; // Gère l'erreur en la relançant
    }
};
