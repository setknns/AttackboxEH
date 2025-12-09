// Importeer de Express module
const express = require('express');
const path = require('path');

// Maak een app instantie
const app = express();
const port = 3000;

// Middleware om JSON data te lezen (voor latere uitbreiding)
app.use(express.json());

// Serveer de statische bestanden (HTML, CSS, JS) uit de 'public' map
app.use(express.static(path.join(__dirname, 'public')));

// Maak een "API endpoint" voor het claimen
app.post('/claim', (req, res) => {
    console.log('Nieuwe claim ontvangen!');

    // Hier zou je normaal gesproken code uitvoeren:
    // 1. Gegevens opslaan in een database
    // 2. Een bevestigingsmail sturen
    // 3. Voorraad controleren

    // We sturen een succesbericht terug naar de frontend
    res.status(200).json({
        success: true,
        message: 'Claim ontvangen! Je Red Bull komt eraan (niet echt, dit is een demo).'
    });
});

// Start de server
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});