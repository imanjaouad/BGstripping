const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const FILE_PATH = './products.json';

function readProducts() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]');
  }
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2));
}

app.get('/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produit introuvable' });
  }

   res.json(product);
});

app.post('/products', (req, res) => {
  const products = readProducts();

  const newProduct = {
    id: products.length + 1,
    nom: req.body.nom,
    prix: req.body.prix
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

app.put("/books/:id", (req, res) => {
  const books = readProducts(res);
  if (!producs) return;

  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  book.name = req.body.name;
  book.price = req.body.price;

  if (writeProducts(res, products)) {
    res.status(200).json(products);
  }
});

