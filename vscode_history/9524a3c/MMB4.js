const amqp = require("amqplib");

async function sendTest() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "notifications";

  await channel.assertQueue(queue, { durable: true });

  const message = {
    userId: "63f3a8f4c7e4a123456789ab",
    message: "test de notification pour ce utilisateur !"
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log("Message envoyé à RabbitMQ");
  await channel.close();
  await conn.close();
}

sendTest();