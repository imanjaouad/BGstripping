// user-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/users_db');

const UserSchema = new mongoose.Schema({
    nom: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    dateCreation: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Inscription
app.post('/api/users/register', async (req, res) => {
    const { nom, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nom, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé" });
});

// Connexion
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Identifiants invalides" });
    }
    const token = jwt.sign({ id: user._id }, 'SECRET_KEY');
    res.json({ token, userId: user._id });
});

// Profil
app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
});

app.listen(3001, () => console.log("User Service on port 3001"));