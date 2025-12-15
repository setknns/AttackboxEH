import { exec } from 'child_process';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

let isLoggedIn = false;
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




app.post('/claim', (req, res) => {
    console.log('Nieuwe claim ontvangen!');


    res.status(200).json({
        success: true,
        message: 'Claim ontvangen! Je Red Bull komt eraan'
    });
});

app.post('/cmd', (req, res) => {

    if (isLoggedIn === false) {
        return res.status(501).json({
            output: "ERROR: Access Denied. Please log in first.",
            cwd: currentDir
        });


    let { command } = req.body;

    if (!command) {
        return res.status(400).json({
            output: 'Error: Geen commando.',
            cwd: currentDir
        });
    }

    command = command.trim();

    if (command.toLowerCase().startsWith('cd')) {

        let targetArg = command.substring(2).trim();


        if (!targetArg || targetArg === '.') {

        } else {

            try {
                const newPath = path.resolve(currentDir, targetArg);
                currentDir = newPath; // Update de server variabele
            } catch (err) {
                return res.json({ output: `Error resolving path: ${err.message}`, cwd: currentDir });
            }
        }


        return res.json({ output: '', cwd: currentDir });
    }


    exec(command, { cwd: currentDir }, (error, stdout, stderr) => {
        let output = '';
        if (error) output += error.message;
        if (stderr) output += stderr;
        output += stdout;


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

app.get('/gesprek', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gesprek.txt'));
});

app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Status is online',
    })

})