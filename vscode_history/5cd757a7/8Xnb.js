const express = require('express')
const data = require('./simple.js')
const app = express()

app.use(express.json())

const PORT= 3000;
let stagiaires = [];

// GET :
app.get('/stagiaires',(req,res)=>{
    const data_stagiares = [...stagiaires, ...data];
    res.json(data_stagiares);
})

// POST :
app.post('/stagiaires/create',(req,res)=>{
    stagiaires.push(req.body);
    res.status(201).send('stagiaire created');
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
