// notification-service/app.js
const express = require('express');
const mongoose = require('mongoose');
// 1. Import dyal l'fonction consumeMessages li sawbti f'consumer.js
const { consumeMessages } = require('./rabbitmq/consumer');

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost/notifications_db')
    .then(() => console.log("Connected to MongoDB Notifications"))
    .catch(err => console.error(err));

// Modèle Notification
const Notification = mongoose.model('Notification', {
    userId: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// --- ÉCOUTE RABBITMQ (SCÉNARIOS 1 & 2) ---
// Kan'esma3o l'ga3 les events dial 'order.created' o 'order.status.updated'
consumeMessages('notification_queue', ['order.created', 'order.status.updated'], async (payload) => {
    
    console.log(`[RabbitMQ] Event reçu: ${payload.event}`);

    let msgText = "";
    const { data } = payload; // Kandokhlo l data li siftat l'Order Service

    // Scénario 1 : Création de commande
    if (payload.event === 'order.created') {
        msgText = `Votre commande ${data.orderId} a été créée avec succès. Montant: ${data.totalAmount}DH`;
    } 
    // Scénario 2 : Mise à jour de statut
    else if (payload.event === 'order.status.updated') {
        msgText = `Le statut de votre commande ${data.orderId} est désormais : ${data.status}`;
    }

    // Sauvegarder f'l'historique (Obligatoire)
    const newNotif = new Notification({
        userId: data.userId,
        message: msgText
    });

    await newNotif.save();
    console.log(`[Notification Saved] Pour User ${data.userId}: ${msgText}`);
});

// --- ENDPOINT OBLIGATOIRE ---
app.get('/api/notifications/:userId', async (req, res) => {
    try {
        const history = await Notification.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3004, '0.0.0.0', () => {
    console.log("🚀 Notification Service prêt sur port 3004");
});