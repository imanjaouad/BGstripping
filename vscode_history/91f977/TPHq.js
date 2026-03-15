const mongoose = require("mongoose");

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

const Livre = require("./models/Livre");


// récupérer les livres  : 
app.get("/livres",async (req,res)=>{
    const livre = await Livre.find()
    res.json(livre);
})

// ajouter un livre :
app.post("/livres",async(req,res)=>{
    const livre = new Livre(req.body)
    await livre.save()
    res.json(livre);
})

// recupérer le livre par id
app.get("/livres/:id",async (req,res)=>{
    const livre = Livre.findById(req.params.id)
})

// modifier un livre :
app.put("/livres/:id",async (req,res)=>{
    const livre = await Livre.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    if (!livre) return res.status(404).json({message:"le livre est introuvable !"});
    res.json(livre);
});


// delete livre :
app.delete("/livres/:id",async (req,res)=>{
    const livre = await Livre.findByIdAndDelete(req.params.id);
    res.json(livre);
})

// lancement du serveur sur le port 3000 :
app.listen(3000,()=>{
    console.log("serveur demarré sur le port 3000 ")
})


