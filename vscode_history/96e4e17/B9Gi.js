const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const amqp = require("amqplib");

const notificationRoutes = require("./routes/notificationRoutes");
const { createNotification } = require("./controllers/notificationController");

const app = express();
app.use(cors());
app.use(express.json());

// 1️⃣ Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/notificationsDB")
  .then(() => console.log("MongoDB connecté - Notifications Service"))
  .catch(err => console.log(err));

// 2️⃣ Routes
app.use("/api/notifications", notificationRoutes);

// 3️⃣ Démarrer le serveur
const PORT = 3004;
app.listen(PORT, () => console.log(`Notifications Service running on port ${PORT}`));

// 4️⃣ Écoute RabbitMQ
async function listenRabbit() {
  try {
    const conn = await amqp.connect("amqp://localhost");
    const channel = await conn.createChannel();
    const queue = "notifications";

    await channel.assertQueue(queue, { durable: true });
    console.log("Notifications service écoute RabbitMQ...");

    channel.consume(queue, msg => {
      if(msg) {
        const data = JSON.parse(msg.content.toString());
        createNotification(data.userId, data.message);
        channel.ack(msg);
      }
    });
  } catch(err) {
    console.error("RabbitMQ error:", err.message);
  }
}

listenRabbit();