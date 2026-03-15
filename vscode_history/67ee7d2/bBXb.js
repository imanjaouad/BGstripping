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

app.post('./products',(req,res)=>{
    fs.readFile('./products.json','utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({message:"Erreur de lecture du fichier"})
            
        }

        const products = JSON.parse(data)

        const newProduct = {
            id : products.length + 1,
            nom : req.nom.body,
            prix : req.prix.body
        }

        products.push(newProduct);

        fs.writeFile('./products.json',JSON.stringify(products,null,2))
        err =>{
            if (err){
                return res.status(500).json({message : "erreur d'écriture"})

            }
            res.status(201).json(newProduct);

        }
    })
})

app.listen(3000,()=>{
    console.log("serveur démarre sur localhost:3000")
})