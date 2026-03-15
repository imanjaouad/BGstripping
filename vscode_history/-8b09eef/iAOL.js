// notification-service/rabbitmq/consumer.js
const amqp = require('amqplib');

async function consumeMessages(queueName, routingKeys, callback) {
    try {
        // 1. Connexion l'RabbitMQ (Docker)
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        
        // 2. Déclaration dial l'Exchange (khass ikoun smito 'orders')
        const exchangeName = 'orders';
        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        // 3. Déclaration dial l'Queue
        const q = await channel.assertQueue(queueName, { durable: true });

        // 4. Liaison (Binding) dyal l'queue m3a les routing keys (created, updated...)
        routingKeys.forEach(key => {
            channel.bindQueue(q.queue, exchangeName, key);
        });

        console.log(`[*] En attente de messages dans la queue: ${queueName}`);

        // 5. Consommation dial l'message
        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content); // Kandowzo l'message l'app.js bach ikhdem bih
                channel.ack(msg);  // Kan'goulo l'RabbitMQ ra l'khbar wsal
            }
        });
    } catch (error) {
        console.error("Erreur RabbitMQ Consumer:", error);
    }
}

module.exports = { consumeMessages };