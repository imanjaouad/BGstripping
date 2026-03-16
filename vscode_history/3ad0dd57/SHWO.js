// product-service/app.js
const express = require('express');
const mongoose = require('mongoose');
// 1. Import dyal l'fonction consumeMessages
const { consumeMessages } = require('./rabbitmq/consumer');

const app = express();
app.use(express.json());

// Connexion MongoDB (Utilisation de 127.0.0.1 pour la stabilité)
mongoose.connect('mongodb://127.0.0.1:27017/products_db')
    .then(() => console.log("✅ [Product Service] Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Error:", err));

const Product = mongoose.model('Product', {
    nom: String,
    description: String,
    prix: Number,
    quantiteStock: Number,
    categorie: String
});

// --- SCÉNARIO 1 : MISE À JOUR AUTOMATIQUE DU STOCK ---
// Le service écoute RabbitMQ pour l'événement 'order.created'
consumeMessages('product_stock_queue', ['order.created'], async (payload) => {
    console.log("📦 [RabbitMQ] Commande reçue ! Analyse pour mise à jour du stock...");
    
    const { products } = payload.data; // Hadou homa l'produits li jaw f'l'message

    try {
        for (const item of products) {
            // item.id = ID dial produit | item.qty = quantité commandée
            const updatedProduct = await Product.findByIdAndUpdate(
                item.id, 
                { $inc: { quantiteStock: -item.qty } }, // Décrémentation du stock
                { new: true }
            );

            if (updatedProduct) {
                console.log(`✅ Stock mis à jour pour [${updatedProduct.nom}]. Nouveau stock: ${updatedProduct.quantiteStock}`);
            } else {
                console.log(`⚠️ Produit ID ${item.id} introuvable en base.`);
            }
        }
    } catch (error) {
        console.error("❌ Erreur RabbitMQ Stock Update:", error.message);
    }
});

// --- ENDPOINTS OBLIGATOIRES (Partie 2.2) ---

// 1. Liste des produits
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// 2. Détails d'un produit
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Ajout d'un produit (Admin)
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Modification d'un produit
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`🚀 Product Service khdam f port ${PORT}`));