const amqp = require('amqplib');

async function publishMessage(routingKey, data) {
    let connection;
    try {
        // 1. Connexion (Utilisation de 127.0.0.1 plus stable sur Windows)
        connection = await amqp.connect('amqp://127.0.0.1');
        const channel = await connection.createChannel();
        const exchangeName = 'orders';

        // 2. Configuration de l'exchange (Topic)
        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        // 3. Structure du message (Respect du cahier des charges)
        const message = {
            event: routingKey,
            timestamp: new Date().toISOString(),
            data: data
        };

        // 4. Envoi du message
        const isSent = channel.publish(
            exchangeName, 
            routingKey, 
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        if (isSent) {
            console.log(`✅ [RabbitMQ] Message envoyé : ${routingKey}`);
        }

        // 5. Fermer le channel proprement
        await channel.close();

    } catch (error) {
        console.error("❌ [RabbitMQ Publisher Error]:", error.message);
        // On renvoie l'erreur pour que app.js puisse la gérer sans crash
        throw error; 
    } finally {
        // 6. Toujours fermer la connexion à la fin
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error closing RabbitMQ connection:", closeError.message);
            }
        }
    }
}

module.exports = { publishMessage };