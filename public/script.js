// Wacht tot de pagina geladen is
document.addEventListener('DOMContentLoaded', () => {

    const claimButton = document.getElementById('claimButton');
    const responseMessage = document.getElementById('responseMessage');

    // Voeg een 'click' event listener toe aan de knop
    claimButton.addEventListener('click', () => {
        console.log('Knop geklikt!');

        // Maak de knop tijdelijk onbruikbaar om dubbele claims te voorkomen
        claimButton.disabled = true;
        claimButton.textContent = 'Bezig met verwerken...';
        responseMessage.textContent = '';

        // Stuur een verzoek naar de backend (onze Node.js server)
        fetch('/claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Je kunt hier data meesturen, bijv. een e-mailadres
            // body: JSON.stringify({ email: 'test@example.com' })
        })
            .then(response => response.json()) // Zet het antwoord om naar JSON
            .then(data => {
                // Verwerk het antwoord van de server
                if (data.success) {
                    responseMessage.textContent = data.message;
                    responseMessage.className = 'success';
                    claimButton.textContent = 'Claim Gelukt!';
                } else {
                    throw new Error(data.message || 'Er ging iets mis.');
                }
            })
            .catch(error => {
                // Vang eventuele fouten op
                console.error('Fout bij claimen:', error);
                responseMessage.textContent = 'Oeps! Er ging iets mis. Probeer het later opnieuw.';
                responseMessage.className = 'error';
                claimButton.disabled = false; // Maak de knop weer bruikbaar
                claimButton.textContent = 'Claim Nu!';
            });
    });
});