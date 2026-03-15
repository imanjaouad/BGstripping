const Product = require("../models/Product");

// GET /api/products - liste tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id - détail produit
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products - ajouter produit
exports.createProduct = async (req, res) => {
  try {
    const { nom, description, prix, quantite, categorie } = req.body;
    const product = new Product({ nom, description, prix, quantite, categorie });
    await product.save();
    res.status(201).json({ message: "Produit ajouté avec succès", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:id - modifier produit
exports.updateProduct = async (req, res) => {
  try {
    const { nom, description, prix, quantite, categorie } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { nom, description, prix, quantite, categorie },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit mis à jour", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};