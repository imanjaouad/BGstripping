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

app.put("/products/:id", (req, res) => {
  const products = readProducts(res);
  if (!products) return;

  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  book.name = req.body.name;
  book.price = req.body.price;

  if (writeProducts(res, products)) {
    res.status(200).json(products);
  }
});


app.delete("/products/:id", (req, res) => {
  const products = readProducts(res);
  if (!products) return;

  const id = parseInt(req.params.id);
  const newProduct = products.filter((p) => p.id !== id);

  if (products.length === newProduct.length) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  if (writeBooks(res, newProduct)) {
    res.status(200).json({ message: "Livre supprimé avec succès" });
  }
});

/* =====================================================
 Lancement du serveur
===================================================== */
app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
