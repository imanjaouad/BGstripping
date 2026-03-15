const express = require('express')
const data = require('./simple.js')
const app = express()

// middlware : 

/*Un middleware est une fonction qui s’exécute entre la requête du client et la réponse du serveur.
Il peut :
lire la requête
la modifier
bloquer ou autoriser l’accès
ajouter des données utiles*/
//Lire et transformer les données JSON envoyées dans le corps de la requête (req.body)

app.use(express.json())
const PORT= 3000;
let stagiaires = [];

// Route get :

app.get('/stagiaires',(req,res)=>{
    const data_stagiares = [...stagiaires,...data];
    res.json(data_stagiares);

})
// Route post :

app.post('/stagiaires',(req,res)=>{
    const data_stagiares = [...stagiaires,...data];
    res.json(data_stagiares);