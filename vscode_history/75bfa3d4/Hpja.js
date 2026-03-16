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

