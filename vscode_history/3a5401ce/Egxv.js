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
    
})