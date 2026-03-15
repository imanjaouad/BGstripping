const amqp = require('amqplib');

async function publishMessage(routingKey, data) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'orders';

        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        const message = { 
            event: routingKey, 
            timestamp: new Date().toISOString(), 
            data: data 
        };

        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
        console.log(`[RabbitMQ] Message envoyé : ${routingKey}`);

        setTimeout(() => connection.close(), 500);
    } catch (error) {
        console.error("Erreur Publisher:", error);
    }
}
module.exports = { publishMessage };