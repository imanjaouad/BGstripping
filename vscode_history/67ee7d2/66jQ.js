const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

function ensrefileExists (){
    if(!fs.existsSync(FILE_PATH)){
        fs.writeFileSync(FILE_PATH,'[]')
    }

}




// GET : Récupérer tous les produits
app.get("/products", (req, res) => {

})

// POST : Ajouter un produit
app.post("/products", (req, res) => {
  fs.readFile("./products.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de lecture du fichier" });
    }

    const products = JSON.parse(data);

    const newProduct = {
      id: products.length + 1,
      nom: req.body.nom,
      prix: req.body.prix,
    };

    products.push(newProduct);

    fs.writeFile(
      "./products.json",
      JSON.stringify(products, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur d'écriture" });
        }
        res.status(201).json(newProduct);
      }
    );
  });
});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Serveur démarré sur localhost:3000");
});
