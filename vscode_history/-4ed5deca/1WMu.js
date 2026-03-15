const express = require('express');
const mongoose = require('mongoose');
const { publishMessage } = require('./rabbitmq/publisher');

const app = express();
app.use(express.json());

// --- 1. ANTI-CRASH PROTECTION ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ [Order Service] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('⚠️ [Order Service] Uncaught Exception:', err);
});

// --- 2. CONNEXION MONGODB (127.0.0.1) ---
mongoose.connect('mongodb://127.0.0.1:27017/orders_db')
    .then(() => console.log("✅ [MongoDB] Orders DB Connected"))
    .catch(err => console.error("❌ [MongoDB] Error:", err.message));

// Modèle Order (Structure obligatoir : id, userId, produits[], montant total, statut, date)
const Order = mongoose.model('Order', {
    userId: String,
    produits: Array, // ex: [{id: "P1", qty: 2}]
    montantTotal: Number,
    statut: { type: String, default: 'en attente' },
    date: { type: Date, default: Date.now }
});

// --- 3. SCÉNARIO 1 : CRÉATION DE COMMANDE ---
app.post('/api/orders', async (req, res) => {
    try {
        console.log("📥 Requête reçue pour nouvelle commande...");
        const order = new Order(req.body);
        await order.save();
        console.log("💾 Commande sauvée en DB.");

        // Publication de l'événement 'order.created'
        try {
            await publishMessage('order.created', {
                orderId: order._id,
                userId: order.userId,
                products: order.produits, // Pour le service Produit
                totalAmount: order.montantTotal // Pour le service Notification
            });
        } catch (rabbitErr) {
            console.error("❌ RabbitMQ Error (Created):", rabbitErr.message);
        }
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 4. SCÉNARIO 2 : MISE À JOUR DU STATUT ---
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { statut } = req.body; // ex: "confirmée", "expédiée", "livrée"
        
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { statut: statut }, 
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Commande introuvable" });

        console.log(`✅ Statut mis à jour : ${statut}`);

        // Publication de l'événement 'order.status.updated' (Scénario 2)
        try {
            await publishMessage('order.status.updated', {
                orderId: order._id,
                userId: order.userId,
                status: order.statut
            });
        } catch (rabbitErr) {
            console.error("❌ RabbitMQ Error (Status Updated):", rabbitErr.message);
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 5. ENDPOINTS DE RÉCUPÉRATION (Partie 2.3) ---

// Détails d'une commande
app.get('/api/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
});

// Commandes d'un utilisateur
app.get('/api/orders/user/:userId', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
});

// Route de test
app.get('/test', (req, res) => res.send("Order Service is Online!"));

// --- LANCEMENT ---
const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [SERVER] Order Service listening on http://127.0.0.1:${PORT}`);
});