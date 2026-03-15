const Order = require("../models/Order");

// POST /api/orders - création commande
exports.createOrder = async (req, res) => {
  try {
    const { userId, produits, montantTotal } = req.body;

    const order = new Order({
      userId,
      produits,
      montantTotal
    });

    await order.save();
    res.status(201).json({ message: "Commande créée avec succès", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id - détails commande
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande introuvable" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/user/:userId - commandes d'un utilisateur
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/orders/:id/status - mise à jour statut
exports.updateOrderStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Commande introuvable" });
    res.json({ message: "Statut mis à jour", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};