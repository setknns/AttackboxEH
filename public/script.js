
document.addEventListener('DOMContentLoaded', () => {

    const claimButton = document.getElementById('claimButton');
    const responseMessage = document.getElementById('responseMessage');


    claimButton.addEventListener('click', () => {
        console.log('Knop geklikt!');


        claimButton.disabled = true;
        claimButton.textContent = 'Bezig met verwerken...';
        responseMessage.textContent = '';


        fetch('/claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

        })
            .then(response => response.json())
            .then(data => {

                if (data.success) {
                    responseMessage.textContent = data.message;
                    responseMessage.className = 'success';
                    claimButton.textContent = 'Claim Gelukt!';
                } else {
                    throw new Error(data.message || 'Er ging iets mis.');
                }
            })
            .catch(error => {

                console.error('Fout bij claimen:', error);
                responseMessage.textContent = 'Oeps! Er ging iets mis. Probeer het later opnieuw.';
                responseMessage.className = 'error';
                claimButton.disabled = false;
                claimButton.textContent = 'Claim Nu!';
            });
    });
});