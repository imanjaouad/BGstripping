const express = require('express');
const mongoose = require('mongoose');
const { publishMessage } = require('./rabbitmq/publisher');

const app = express();
app.use(express.json());

// --- KHSSNA N'7EBSOU L'CRASH ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ [CRITICAL ERROR] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('⚠️ [CRITICAL ERROR] Uncaught Exception:', err);
});

mongoose.connect('mongodb://127.0.0.1:27017/orders_db')
    .then(() => console.log("✅ [MongoDB] Connected"))
    .catch(err => console.error("❌ [MongoDB] Error:", err.message));

const Order = mongoose.model('Order', {
    userId: String,
    produits: Array,
    montantTotal: Number,
    statut: { type: String, default: 'en attente' }
});

app.get('/test', (req, res) => res.send("Order Service is UP!"));

app.post('/api/orders', async (req, res) => {
    try {
        console.log("📥 Requête reçue...");
        const order = new Order(req.body);
        await order.save();
        console.log("💾 Commande sauvée.");

        // On essaye de publier mais on ne crash pas si RabbitMQ est en panne
        try {
            await publishMessage('order.created', {
                orderId: order._id,
                userId: order.userId,
                products: order.produits,
                totalAmount: order.montantTotal
            });
        } catch (rabbitError) {
            console.error("❌ RabbitMQ Error (but order saved):", rabbitError.message);
        }
        
        res.status(201).json(order);
    } catch (error) {
        console.error("❌ DB Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 4000; // Jerrabna port jdid (4000)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});