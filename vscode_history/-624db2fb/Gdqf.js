const express = require("express");
const fs = require("fs").promises;
const app = express();

app.use(express.json());

const FILE_PATH = "./products.json";

// Initialisation du fichier JSON
(async () => {
  try {
    await fs.access(FILE_PATH); 
  } catch {
    await fs.writeFile(FILE_PATH, "[]", "utf-8");
  }
})();

// lire les produits (async)
async function readProducts(res) {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (res) res.status(500).json({ message: "Erreur de lecture du fichier !" });
    return null;
  }
}

// écrire les produits (async)
async function writeProducts(res, products) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    if (res) res.status(500).json({ message: "Erreur d’écriture du fichier" });
    return false;
  }
}

/* =====================================================
 GET – Récupérer tous les produits
===================================================== */
app.get("/products", async (req, res) => {
  const products = await readProducts(res);
  if (!products) return;
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const products = await readProducts(res);
  if (!products) return;

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
app.post("/products", async (req, res) => {
  const products = await readProducts(res);
  if (!products) return;

  const newProduct = {
    id: products.length + 1,
    nom: req.body.nom,
    prix: req.body.prix,
  };

  products.push(newProduct);
  await writeProducts(res, products);

  res.status(201).json(newProduct);
});

/* =====================================================
 PUT – Modifier un produit
===================================================== */
app.put("/products/:id", async (req, res) => {
  const products = await readProducts(res);
  if (!products) return;

  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  product.nom = req.body.nom;
  product.prix = req.body.prix;

  await writeProducts(res, products);
  res.status(200).json(product);
});

/* =====================================================
 DELETE – Supprimer un produit
===================================================== */
app.delete("/products/:id", async (req, res) => {
  const products = await readProducts(res);
  if (!products) return;

  const id = parseInt(req.params.id);
  const newProducts = products.filter((p) => p.id !== id);

  if (products.length === newProducts.length) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  await writeProducts(res, newProducts);
  res.status(200).json({ message: "Produit supprimé avec succès" });
});

/* =====================================================
 Lancement du serveur
===================================================== */
const PORT = 3000;
app.listen(3000, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
