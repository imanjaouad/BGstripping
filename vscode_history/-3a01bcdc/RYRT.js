const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Endpoints
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.get("/user/:userId", orderController.getOrdersByUser);
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;