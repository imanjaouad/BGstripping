const Notification = require("../models/Notification");

// GET /api/notifications/:userId
exports.getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if(!userId) return res.status(400).json({ error: "userId manquant" });

    const notifications = await Notification.find({ userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer notification (depuis RabbitMQ)
exports.createNotification = async (userId, message) => {
  try {
    if(!userId || !message) throw new Error("userId ou message manquant");

    const notification = new Notification({ userId, message });
    await notification.save();
    console.log(`Notification pour ${userId}: ${message}`);
  } catch (err) {
    console.error("Erreur notification:", err.message);
  }
};