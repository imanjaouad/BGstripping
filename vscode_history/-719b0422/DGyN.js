const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

// GET notifications pour un utilisateur
router.get("/:userId", controller.getNotificationsByUser);

module.exports = router; // <- obligatoire pour que require fonctionne