const express = require('express');
const mongoose = require('mongoose');
const { publishMessage } = require('./rabbitmq/publisher');

const app = express();
app.use(express.json());

// 1. Connection MongoDB avec gestion d'erreur (Bla mat'bloqui l'app)
mongoose.connect('mongodb://127.0.0.1:27017/orders_db')
    .then(() => console.log("✅ [MongoDB] Connected to Orders DB"))
    .catch(err => console.log("❌ [MongoDB] Error:", err.message));

const Order = mongoose.model('Order', {
    userId: String,
    produits: Array,
    montantTotal: Number,
    statut: { type: String, default: 'en attente' },
    date: { type: Date, default: Date.now }
});

// Route Test (Pour vérifier si le port est ouvert)
app.get('/test', (req, res) => res.send("Order Service is Online!"));

app.post('/api/orders', async (req, res) => {
    try {
        console.log("📥 Requête reçue pour création de commande");
        const order = new Order(req.body);
        await order.save();
        
        console.log("💾 Commande sauvée en DB, envoi à RabbitMQ...");
        
        await publishMessage('order.created', {
            orderId: order._id,
            userId: order.userId,
            products: order.produits,
            totalAmount: order.montantTotal
        });
        
        res.status(201).json(order);
    } catch (error) {
        console.log("❌ Erreur POST /orders:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { statut: req.body.statut }, { new: true });
        if (!order) return res.status(404).send("Commande introuvable");

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

app.get('/api/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
});

// 2. Écouter sur 0.0.0.0 (Pour Windows c'est plus stable)
const PORT = 3005;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [SERVER] Order Service listening on http://127.0.0.1:${PORT}`);
});