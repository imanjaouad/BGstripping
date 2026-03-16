const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
app.use(express.json());

const SECRET_KEY= "secret123";
const USERS_FILE= "./users.json";

if(!fs.existsSync(USERS_FILE)){
    fs.writeFile("USERS_FILE",[]);
}


// inscription d'un utilisateur :

app.post("/register",async(req,res)=>{
    const {email,password} =req.body;
})

// lecture du fichier :
const users = JSON.parse(fs.readFileSync(USERS_FILE));

// hachage de mot de passe :

const hashedPassword = await bcrypt.hash(password,10);


// ajout du nouveau utilisateur dans le tableau :

users.push({email,password:hashedPassword});

// sauvearde du tableau mis a jour dans le fichier json :

fs.writeFileSync(USERS_FILE,JSON.stringify(users));

// réponse du succès :
res.status(404).json({message : "utilisatuer crée avec succès !"});

// Route connexion de l'utilisateur :

app.post("/login",async (req,res)=>{
    // récuperation des identifiants de connexion :
    const {email,password} = req.body;

    // lecture de tous les utilisateurs :
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    // recherche de l'utilisateur par email : 
    const user = users.find(u=>u.email === email);
    // si l'utilisateur n'existe pas retourne de ereeur 404:
    if(!user) return res.status(404).json({message : "utilisateur introuvable !"});
    
})