const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
const FILE_PATH = "./products.json";

// Vérifie si le fichier existe
function ensureFileExists() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]", "utf-8");
  }
}

// Lire les produits depuis le fichier
function readProductsSync() {
  ensureFileExists();
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Écrire les produits dans le fichier
function writeProductsSync(products) {
  fs.writeFileSync(FILE_PATH, "utf-8");
}

// GET : Récupérer tous les produits
app.get("/products", (req, res) => {
  try {
    const products = readProductsSync();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erreur de lecture du fichier" });
  }
});

// POST : Ajouter un produit
app.post("/products", (req, res) => {
  try {
    const products = readProductsSync();
    if(!Array.isArray(req.body)){
        return res.status(400).json({message : "le array doit etreun tableau !"})
    }catch(err){
        
    }


    const newProduct = {
      id: products.length + 1,
      nom: req.body.nom,
      prix: req.body.prix,
    };

    products.push(newProduct);

    writeProductsSync(products);

    res.status(201).json(newProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur de lecture ou d'écriture du fichier" });
  }
});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Serveur démarré sur localhost:3000");
});
