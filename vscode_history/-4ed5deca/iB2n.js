// order-service/app.js
const express = require('express');
const mongoose = require('mongoose');
// 1. Kan'importiw l'fonction li sawbti f'publisher.js
const { publishMessage } = require('./rabbitmq/publisher');

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost/orders_db')
    .then(() => console.log("Connected to MongoDB Orders"))
    .catch(err => console.error("MongoDB Error:", err));

// Modèle Order
const Order = mongoose.model('Order', {
    userId: String,
    produits: Array, // ex: [{id: "P1", qty: 2}]
    montantTotal: Number,
    statut: { type: String, default: 'en attente' },
    date: { type: Date, default: Date.now }
});

// --- SCÉNARIO 1 : CRÉATION DE COMMANDE ---
app.post('/api/orders', async (req, res) => {
    try {
        // 1. Sauvegarde f'Base de données
        const order = new Order(req.body);
        await order.save();
        
        // 2. Publication dyal l'événement via RabbitMQ (Scénario 1)
        // Routing Key: 'order.created'
        // Data: kima bghawha f'l'exercice
        await publishMessage('order.created', {
            orderId: order._id,
            userId: order.userId,
            products: order.produits,
            totalAmount: order.montantTotal
        });
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SCÉNARIO 2 : MISE À JOUR DU STATUT ---
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { statut: req.body.statut }, 
            { new: true }
        );

        if (!order) return res.status(404).send("Commande introuvable");

        // 3. Publication dyal l'événement (Scénario 2)
        // Routing Key: 'order.status.updated'
        await publishMessage('order.status.updated', {
            orderId: order._id,
            status: order.statut,
            userId: order.userId
        });
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes dyal récupération (GET)
app.get('/api/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
});

app.get('/api/orders/user/:userId', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Order Service khdam f port ${PORT}`));