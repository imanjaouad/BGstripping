// order-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const express = require('express');
const app = express();
const { publishMessage } = require('./rabbitmq/publisher');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/orders_db');

const Order = mongoose.model('Order', {
    userId: String,
    produits: Array,
    montantTotal: Number,
    statut: { type: String, default: 'en attente' },
    date: { type: Date, default: Date.now }
});

// Connexion RabbitMQ
let channel;
async function connectQueue() {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('order_notifications');
}
connectQueue();

app.post('/api/orders', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    
    // Envoyer événement à RabbitMQ
    const msg = JSON.stringify({ userId: order.userId, orderId: order._id, status: order.statut });
    channel.sendToQueue('order_notifications', Buffer.from(msg));
    
    res.status(201).json(order);
});

app.get('/api/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
});

app.get('/api/orders/user/:userId', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
});

app.put('/api/orders/:id/status', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, { statut: req.body.statut }, { new: true });
    
    // Envoyer mise à jour statut
    channel.sendToQueue('order_notifications', Buffer.from(JSON.stringify(order)));
    
    res.json(order);
});

app.listen(3003, () => console.log("Order Service on port 3003"));