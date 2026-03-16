// rabbitmq/consumer.js
const amqp = require('amqplib');

async function consumeMessages(queueName, routingKeys, callback) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'orders';

        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        
        // Création d'une queue spécifique pour le service
        const q = await channel.assertQueue(queueName, { durable: true });

        // Liaison de la queue aux différents événements (ex: order.created)
        routingKeys.forEach(key => {
            channel.bindQueue(q.queue, exchangeName, key);
        });

        console.log(`[RabbitMQ] Service en attente de messages dans : ${queueName}`);

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content); // Exécute la logique métier du service
                channel.ack(msg);  // Accuse réception
            }
        });
    } catch (error) {
        console.error("[RabbitMQ] Erreur Consumer:", error);
    }
}

module.exports = { consumeMessages };