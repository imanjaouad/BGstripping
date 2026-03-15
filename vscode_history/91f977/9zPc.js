const mongoose = require("mongosse");

const express = require("express");

const app = express();

app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/ma_bibliotheque")
.then(()=>{
    console.log("base de données connecté")
})
.catch((err)=>{
    console.log("erreur de connexion",err)
})

const livre = require("./models/livre");


// ajouter livre : 

app.get("/livres",async (req,res)=>{
    const livre = await livre.find()
    res.json(livre);
})


app.post("/livres",async(req,res)=>{
    const livre = new livre(req.body)
    await livre.save()
    res.json(livre);
})


app.get("/livres/id",async (req,res)=>{
    const livre = 
})

