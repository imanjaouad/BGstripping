const express = require('express');
const mongoose = require('mongoose');
const { consumeMessages } = require('./rabbitmq/consumer');

const app = express();
app.use(express.json());

// --- 1. ANTI-CRASH PROTECTION (B7al Order Service) ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ [Product Service] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('⚠️ [Product Service] Uncaught Exception:', err);
});

// --- 2. CONNEXION MONGODB (127.0.0.1) ---
mongoose.connect('mongodb://127.0.0.1:27017/products_db')
    .then(() => console.log("✅ [MongoDB] Product DB Connected"))
    .catch(err => console.error("❌ [MongoDB] Error:", err.message));

// Modèle Product
const Product = mongoose.model('Product', {
    nom: String,
    description: String,
    prix: Number,
    quantiteStock: Number,
    categorie: String
});

// --- 3. SCÉNARIO 1 : MISE À JOUR DU STOCK (RabbitMQ) ---
consumeMessages('product_stock_queue', ['order.created'], async (payload) => {
    console.log("📦 [RabbitMQ] Commande reçue ! Mise à jour du stock en cours...");
    
    try {
        const { products } = payload.data; // Recupération des produits commandés

        for (const item of products) {
            // item.id = ID du produit | item.qty = Quantité commandée
            const updatedProduct = await Product.findByIdAndUpdate(
                item.id, 
                { $inc: { quantiteStock: -item.qty } }, 
                { new: true }
            );

            if (updatedProduct) {
                console.log(`✅ Stock mis à jour : [${updatedProduct.nom}] | Nouveau Stock: ${updatedProduct.quantiteStock}`);
            } else {
                console.log(`⚠️ Produit ID ${item.id} introuvable.`);
            }
        }
    } catch (error) {
        console.error("❌ [RabbitMQ Error] Stock Update failed:", error.message);
    }
});

// --- 4. ENDPOINTS API ---

// Route Test
app.get('/test-product', (req, res) => res.send("Product Service is Online on Port 5000!"));

// Liste des produits
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Ajouter un produit (Admin)
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Détails d'un produit
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 5. LANCEMENT DU SERVEUR (Port 5000) ---
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [SERVER] Product Service listening on http://127.0.0.1:${PORT}`);
});