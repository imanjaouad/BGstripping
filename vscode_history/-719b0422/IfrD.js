const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

router.get("/:userId", controller.getNotificationsByUser);

module.exports = router;