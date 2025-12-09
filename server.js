import { exec } from 'child_process';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

let isLoggedIn = false;

let users = {
    'REDBULL_ADMIN':{
        password: 'ad;kjslfneo;ifsdfkl;jvlks',
        question1: 'Vraag',
        question2: 'Vraag 2',
        answer1: 'pop',
        answer2: '10 oktober'
    }
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username].password === password) {
        isLoggedIn = true;
        return res.json({success: true, message:`Logged into ${username}`});
    }else{
        return res.status(401).json({success: false, message: 'Invalid username or password'});
    }
})

app.post('/api/get-question', (req, res) => {
    const { username } = req.body;

    if (users[username]) {
        return res.json({
            success: true,
            question: users[username].question
        });
    } else {
        return res.status(404).json({ success: false, message: 'Couldnt find user' });
    }
});

app.post('/api/reset-password', (req, res) => {
    const { username, answer1, answer2, newPassword } = req.body;

    if (!users[username]) {
        return res.status(400).json({ success: false, message: 'Coudlnt find user' });
    }

    if(!answer1  || !answer2){
        return res.status(400).json({ success: false, message: 'No answer'});
    }
    console.log(`Reset password  ${answer1, answer2}`);

    const storedAnswer = users[username].answer1
    const storedAnswer2 = users[username].answer2



    if (storedAnswer === answer1 && storedAnswer2 === answer2) {
        users[username].password = newPassword;
        console.log(`Changed password for ${username}`);

        return res.json({success: true, message: 'Password changed successfully'});

    } else {
        return res.status(403).json({ success: false, message: 'Wrong answer' });
    }
})



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

app.post('/cmd', (req, res) => {

    if (isLoggedIn === false) {
        console.log("Unauthorized cmd pull")
        return res.status(501).send("501: Niet ingelogd")

    }
    const { command } = req.body;

    if (!command) {
        return res.status(400).send('Commando is verplicht.');
    }

    // Voer het commando uit dat de gebruiker heeft gestuurd
    exec(command, (error, stdout, stderr) => {
        if (error) {
            // Stuur de foutmelding terug
            return res.status(500).send(`<pre>${error.message}</pre>`);
        }
        if (stderr) {
            // Stuur stderr terug
            return res.status(500).send(`<pre>${stderr}</pre>`);
        }

        // Stuur het resultaat van het commando terug
        res.status(200).send(`<pre>${stdout}</pre>`);
    });
});

// Start de server
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Status is online',
    })

})