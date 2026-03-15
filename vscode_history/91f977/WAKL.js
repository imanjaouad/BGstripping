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

// ajouter un livre :
app.post("/livres",async(req,res)=>{
    const livre = new livre(req.body)
    await livre.save()
    res.json(livre);
})

// recupérer tous les livres :
app.get("livres/id",async (req,res)=>{
    const livre = livre.findById(req.params.id)
})

// modifier un livre :
app.put("livres/:id",async (req,res)=>{
    const livre = await livre.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    if (!livre) return res.status(404).json({message:"le livre est introuvable !"});
    res.json(livre);
});


// delete livre 
app.delete("livres/:id",async (req,res)=>{
    const livre = await livre.findByIdAndDelete(req.params.id);
    res.json(livre);
})


app.listen(3000,()=>{
    console.log("serveur demarré sur le port 3000 ")
})


