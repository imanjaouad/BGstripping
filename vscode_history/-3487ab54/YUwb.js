// rabbitmq/publisher.js
const amqp = require('amqplib');

async function publishMessage(routingKey, data) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'orders';

        // Configuration de l'exchange (type 'topic' pour router précisément les événements)
        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        // Structure du message demandée
        const message = {
            event: routingKey,
            timestamp: new Date().toISOString(),
            data: data
        };

        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
        
        console.log(`[RabbitMQ] Message envoyé : ${routingKey}`);
        
        setTimeout(() => connection.close(), 500);
    } catch (error) {
        console.error("[RabbitMQ] Erreur Publisher:", error);
    }
}

module.exports = { publishMessage };