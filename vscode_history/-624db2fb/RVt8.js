const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const FILE_PATH = "./products.json";

// Initialisation
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]", "utf-8");
}

// lire les produits
function readProducts(res) {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    res.status(500).json({ message: "erreur de lecture du fichier !" });
    return null;
  }
}

// écrire les produits
function writeProducts(res, products) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    res.status(500).json({ message: "Erreur d’écriture du fichier" });
    return false;
  }
}


/* =====================================================
 GET – Récupérer tous les produits
===================================================== */
app.get("/products", (req, res) => {
  res.json(readProducts()); 
});

app.get("/products/:id", (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Produit introuvable" });
  }

  res.json(product);
});

/* =====================================================
 POST – Ajouter un produit
===================================================== */
app.post("/products", (req, res) => {
  const products = readProducts();

  const newProduct = {
    id: products.length + 1,
    nom: req.body.nom,
    prix: req.body.prix,
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

/* =====================================================
 PUT – Modifier un produit
===================================================== */
app.put("/products/:id", (req, res) => {
  const products = readProducts();

  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  product.nom = req.body.nom;
  product.prix = req.body.prix;

  writeProducts(products);
  res.status(200).json(product);
});

/* =====================================================
 DELETE – Supprimer un produit
===================================================== */
app.delete("/products/:id", (req, res) => {
  const products = readProducts();

  const id = parseInt(req.params.id);
  const newProducts = products.filter((p) => p.id !== id);

  if (products.length === newProducts.length) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  writeProducts(newProducts);
  res.status(200).json({ message: "Produit supprimé avec succès" });
});

/* =====================================================
 Lancement du serveur
===================================================== */
app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
