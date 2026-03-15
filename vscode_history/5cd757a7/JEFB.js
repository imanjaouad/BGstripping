const express = require('express')
const data = require('./simple.js')
const app = express()

// middlware : 

app.use(express.json());

// Route :

app.get('/stagiaires',(req,res)=>{
    res.status(200).json(data)
})

