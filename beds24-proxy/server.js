const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const PORT = 3001;

require('dotenv').config();
const API_KEY = process.env.REACT_APP_BEDS24_API_KEY;
const PROP_KEY = process.env.REACT_APP_BEDS24_PROP_KEY;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // For parsing application/json

// Recevoir les données
app.post('/proxy/getBookings', (req, res) => {
    const options = {
        method: 'POST',
        url: 'https://api.beds24.com/json/getBookings',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(body);
    });
});


// Send booking route
app.post('/proxy/sendBooking', (req, res) => {
        const { roomId, dates, action } = req.body;
        const bookingData = {
            authentication: {
                apiKey: API_KEY,
                propKey: PROP_KEY,
            },
            roomId: roomId, 
            startDate: dates[0], 
            endDate: dates[dates.length - 1], 
            status: action === 'book' ? 1 : 0, 
            numAdult: 1, // Ajustable
        };

    console.log('Demande de réservation reçue:', req.body);
    const options = {
        method: 'POST',
        url: 'https://api.beds24.com/json/setBooking',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(body);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});
