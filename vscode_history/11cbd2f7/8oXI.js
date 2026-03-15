const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// --- 1. ANTI-CRASH PROTECTION ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ [User Service] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('⚠️ [User Service] Uncaught Exception:', err);
});

// --- 2. CONNEXION MONGODB (127.0.0.1) ---
mongoose.connect('mongodb://127.0.0.1:27017/users_db')
    .then(() => console.log("✅ [MongoDB] Users DB Connected"))
    .catch(err => console.error("❌ [MongoDB] Error:", err.message));

// Modèle User
const UserSchema = new mongoose.Schema({
    nom: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    dateCreation: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// --- 3. ENDPOINTS ---

// Inscription (POST /api/users/register)
app.post('/api/users/register', async (req, res) => {
    try {
        const { nom, email, password } = req.body;
        
        // Hashage du mot de passe (Obligatoire 2.1)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ 
            nom, 
            email, 
            password: hashedPassword 
        });
        
        await user.save();
        console.log(`👤 Utilisateur créé : ${nom}`);
        res.status(201).json({ message: "Utilisateur créé", userId: user._id });
    } catch (error) {
        res.status(400).json({ error: "Email déjà utilisé ou données invalides" });
    }
});

// Connexion (POST /api/users/login)
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }
        
        const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
        
        console.log(`🔑 Login réussi pour : ${email}`);
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupération d'un profil (GET /api/users/:id)
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route de test
app.get('/test-user', (req, res) => res.send("User Service is Online!"));

// --- 4. LANCEMENT (Port 3001 avec 0.0.0.0 pour Docker/Nginx) ---
const PORT = 4500; // Hada kharij l'plage bloquée
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 USER SERVICE KHEDDAM FINALEMENT SUR PORT ${PORT}`);
});