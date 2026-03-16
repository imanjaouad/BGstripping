const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
const FILE_PATH = './products.json';

function ensrefileExists (){
    if(!fs.existsSync(FILE_PATH)){
        fs.writeFileSync(FILE_PATH,'[]',"utf-8")
    }
}




// GET : Récupérer tous les produits
app.get("/products", (req, res) => {
try{
    const data = fs.readFileSync(FILE_PATH,"utf8")
    const products = json.parse(data)
    res.json(products)
}catch (err){
    res.status(500).json({message : "erreur de lecture du fichier"})
}


})

// POST : Ajouter un produit
app.post("/products", (req, res) => {
    try{
        ensrefileExists();

    }catch(err){
        const data = fs.readFileSync()
    }
}

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
