const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const HOST = 'localhost';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
}

// Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        const users = JSON.parse(data);

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        users.push({ username, password, favorites: [] });
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error accessing users.json:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true });
});

// Get Favorites
app.get('/favorites/:username', (req, res) => {
    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const user = users.find(u => u.username === req.params.username);

        res.json({ favorites: user ? user.favorites : [] });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add Favorite
app.post('/favorites', (req, res) => {
    const { username, favorite } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const user = users.find(u => u.username === username);

        if (user && !user.favorites.includes(favorite)) {
            user.favorites.push(favorite);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Favorite
app.delete('/favorites', (req, res) => {
    const { username, favorite } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const user = users.find(u => u.username === username);

        if (user) {
            user.favorites = user.favorites.filter(item => item !== favorite);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit Favorite
app.put('/favorites/edit', (req, res) => {
    const { username, oldFavorite, newFavorite } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const user = users.find(u => u.username === username);

        if (user) {
            const index = user.favorites.indexOf(oldFavorite);
            if (index > -1) {
                user.favorites[index] = newFavorite;
                fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
            }
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start Server
app.listen(PORT, HOST, () => {
    console.log(`✅ Server running at http://${HOST}:${PORT}`);
});