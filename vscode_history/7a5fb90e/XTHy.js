const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },         // l'utilisateur li dar la commande
  produits: [                                      // liste produits f la commande
    {
      productId: String,
      nom: String,
      prix: Number,
      quantite: Number
    }
  ],
  montantTotal: { type: Number, required: true },  // total price
  statut: {                                        // statut de la commande
    type: String,
    enum: ["en attente", "confirmée", "expédiée", "livrée"],
    default: "en attente"
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);