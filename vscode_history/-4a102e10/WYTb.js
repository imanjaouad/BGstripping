const amqp = require('amqplib');

async function consumeMessages(queueName, routingKeys, callback) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'orders';

        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        const q = await channel.assertQueue(queueName, { durable: true });

        routingKeys.forEach(key => {
            channel.bindQueue(q.queue, exchangeName, key);
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Erreur Consumer:", error);
    }
}
module.exports = { consumeMessages };