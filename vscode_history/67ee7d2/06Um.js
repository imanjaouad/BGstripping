const express = require("express");
const fs = require('fs')
const data = require('./products.json');

app.use(express.json())

app.get('./products.json',(req,res)=>{
    fs.readFile('./products.json','utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({message:"erreur de lecture de fichier"})

    
        }
        const products = JSON.parse(data)
        res.json(products)
    })
})

// route post :

app.post('/products', (req, res) => { 
 // Lire le fichier products.json pour récupérer les produits existants
 fs.readFile('./products.json', 'utf8', (err, data) => { 
 if (err) { 
 // Si une erreur survient lors de la lecture du fichier, envoyer un message d'erreur 
500
 return res.status(500).json({ message: "Erreur de lecture" }); 
 } 
 // Convertir le texte JSON lu en tableau JavaScript
 const products = JSON.parse(data); 
 // Créer un nouvel objet produit à partir des données envoyées par le client
 const newProduct = { 
 id: products.length + 1, // Générer un ID automatiquement (nombre de produits + 
1)
 nom: req.body.nom, // Nom du produit reçu dans le body de la requête
 prix: req.body.prix // Prix du produit reçu dans le body de la requête
 }; 
 // Ajouter le nouveau produit au tableau existant
 products.push(newProduct); 
 // Réécrire le fichier JSON avec le tableau mis à jour
 fs.writeFile( 
 './products.json', 
 JSON.stringify(products, null, 2), // Convertir le tableau JS en JSON formaté (2 
espaces)
 err => { 
 if (err) { 
 // Si une erreur survient lors de l'écriture du fichier, envoyer un message 
d'erreur 500
 return res.status(500).json({ message: "Erreur d'écriture" }); 
 } 
 // Si tout se passe bien, renvoyer le nouveau produit avec le statut 201 (créé)
 res.status(201).json(newProduct); 
 } 
 ); 
 }); 
}); 
// Lancer le serveur
app.listen(3000, () => { 
 console.log('Serveur démarré sur http://localhost:3000'); 
});