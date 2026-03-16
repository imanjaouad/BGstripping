// product-service/server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/products_db');

const Product = mongoose.model('Product', {
    nom: String,
    description: String,
    prix: Number,
    quantiteStock: Number,
    categorie: String
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
});

app.put('/api/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
});

app.listen(3002, () => console.log("Product Service on port 3002"));