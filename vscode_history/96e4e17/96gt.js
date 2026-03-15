// notification-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/notifications_db');

const Notification = mongoose.model('Notification', {
    userId: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// Écoute RabbitMQ
async function consume() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('order_notifications');

    channel.consume('order_notifications', async (data) => {
        const orderInfo = JSON.parse(data.content.toString());
        const message = `Commande ${orderInfo.orderId} mise à jour : ${orderInfo.status}`;
        
        console.log(`[Notification] Envoi à ${orderInfo.userId}: ${message}`);
        
        // Sauvegarder en historique
        const notif = new Notification({ userId: orderInfo.userId, message });
        await notif.save();
        
        channel.ack(data);
    });
}
consume();

app.get('/api/notifications/:userId', async (req, res) => {
    const history = await Notification.find({ userId: req.params.userId });
    res.json(history);
});

app.listen(3004, () => console.log("Notification Service on port 3004"));