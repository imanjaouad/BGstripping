const mongoose = require("mongoose");
const express = require("express");

const app = express();


app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/tp_api')
.then(()=>{
    console.log("mongodb connecté avec succès")
})

.catch((error)=>{
    console.log("erreur de connexion mongodb",erreur)
})


const User= require("./models/User");


app.post("/users",async (req,res)=>{
    const user = new User(req.body);
    await user.save();
    res.json(user);
})

app.get("/users",async (req,res)=>{
    const users = await User.find();
    res.json(users);
})

app.get("/users/:id",async (req,res)=>{
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({message : "user introuvable !"})
    res.json(user);
})


app.put("/users/:id",async (req,res)=>{
    const user= await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.json(user);
})

app.delete("/users/:id",async (req,res)=>{
    await User.findByIdAndDelete(
        req.params.id
    )
    res.json({message : "user supprimé avec succès !"})
})



app.listen(3000,()=>{
    console.log("serveur demarré sur http://localhost:3000")
})
