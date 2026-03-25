const express = require(express);

const data = require(./donnees)

const app = express();


let categories = [];

app.get('./donnees.js',(req,res)=>{
    const data_categories = [...categories,...data]
    res.json(data_categories)

})

app.post('./donnees.js/create',(req,res)=>{
    categories.push(req.)
})