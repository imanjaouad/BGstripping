const express = require(express);

const data = require('./donnees')

const app = express();


app.use(express.json())
let categories = [];

const PORT = 3000;

app.get('./donnees.js',(req,res)=>{
    const data_categories = [...categories,...data]
    res.json(data_categories)

})

app.post('./donnees.js/create',(req,res)=>{
    categories.push(req.body)
    res.send('categorie created')
})

app.listen(PORT,()=>console.log(`server a ete lancé avec succès sur le port ${POST}`))


