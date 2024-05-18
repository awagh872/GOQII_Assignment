const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
const connectDB = require("./utils/db");
var cors = require('cors')

app.use(cors());

app.use(express.json());

let users = [
    { id: 1, name: "John Doe", email: "john@example.com", password: "password1", dob: "1990-01-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password2", dob: "1995-05-15" }
];

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update user by ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    let userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.json(users[userIndex]);
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(user => user.id !== userId);
    res.status(204).end();
});

const PORT = 5000;

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.warn(`Server is running at Port: ${PORT}`);
    });
});
