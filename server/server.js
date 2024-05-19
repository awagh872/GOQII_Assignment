const express = require('express');
const sqlite3 = require('sqlite3').verbose();
var cors = require('cors')

const app = express();
app.use(cors());

const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database('./users.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    dob TEXT
)`);

app.post('/users', (req, res) => {
    const { name, email, password, dob } = req.body;
    db.run('INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)', [name, email, password, dob], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            name,
            email,
            dob
        });
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(row);
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, dob } = req.body;
    db.run('UPDATE users SET name = ?, email = ?, password = ?, dob = ? WHERE id = ?', [name, email, password, dob, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            name,
            email,
            dob
        });
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User deleted', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

