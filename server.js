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

let isLoggedIn = true;
let currentDir = process.cwd();

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


    res.status(200).json({
        success: true,
        message: 'Claim ontvangen! Je Red Bull komt eraan'
    });
});

app.post('/cmd', (req, res) => {
    // 1. Check login
    if (isLoggedIn === false) return res.status(501).send("Log in required.");

    let { command } = req.body;
    if (!command) return res.status(400).send('Geen commando.');

    command = command.trim();

    // 2. Specifieke check voor 'cd' commando's
    // We kijken of het commando begint met 'cd' (hoofdletterongevoelig)
    if (command.toLowerCase().startsWith('cd')) {

        // Haal 'cd' weg van de string.
        // Bij "cd.." blijft ".." over. Bij "cd map" blijft " map" over.
        let targetArg = command.substring(2).trim();

        // Als er niks achter 'cd' staat, of alleen 'cd.', blijf waar je bent
        if (!targetArg || targetArg === '.') {
            // Doe niks, stuur huidige map terug
        } else {
            // Probeer het pad op te lossen
            try {
                const newPath = path.resolve(currentDir, targetArg);
                currentDir = newPath; // Update de server variabele
            } catch (err) {
                return res.json({ output: `Error resolving path: ${err.message}`, cwd: currentDir });
            }
        }

        // Stuur JSON terug met lege output, maar WEL de nieuwe map (cwd)
        return res.json({ output: '', cwd: currentDir });
    }

    // 3. Voer andere commando's uit
    exec(command, { cwd: currentDir }, (error, stdout, stderr) => {
        let output = '';
        if (error) output += error.message;
        if (stderr) output += stderr;
        output += stdout;

        // We sturen nu ALTIJD JSON terug, met de output EN de huidige map
        res.json({ output: output, cwd: currentDir });
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