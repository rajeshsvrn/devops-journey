const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



const USERS_FILE = './users.json';

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'mocked' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { username, email, password, createdAt: new Date() };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json({ user: newUser });
});

app.get('/api/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    res.json({ users });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
