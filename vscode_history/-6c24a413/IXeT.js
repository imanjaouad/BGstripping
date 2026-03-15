const { FILE } = require('dns');
const express = require('express'); 
const fs = require('fs'); 
const app = express();

app.use(express.json());

const FILE_PATH= './books.json';

/* =====================================================
 Fonctions utilitaires (FACTORISATION)
===================================================== */

// Initialiser le fichier JSON

function initFile(){
    if(!fs.existsSync(FILE_PATH)){
        fs.writeFileSync(FILE_PATH,'[]')
    }
}

// Lire les livres :
function readBooks(res){
    try{
        const data = fs.readFileSync(FILE_PATH,'utf-8');
        return JSON.parse(data || '[]')

    }catch(error){
        res.status(500).json({message : 'erreur du lecture du fichier !'})
        return null;
    }

}// Écrire les livres
function writeBooks(res, books) { 
 try { 
 fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2)); 
 return true; 
 } catch (error) { 
 res.status(500).json({ message: 'Erreur d’écriture du fichier' }); 
 return false; 
 } 
}

// Initialisation
initFile();

/* =====================================================
 GET – Récupérer tous les livres
===================================================== */

app.get('./books',(req,res)=>{
    const books = readBooks(res)
    if (books) res.status(200).json(books);
})


/* =====================================================
 POST – Ajouter un livre
===================================================== */

app.post('./books',(req,res)=>{
    const books = readBooks(res)
    if(!books) return;
})

const newBook ={
    id : books.length + 1,
    title : books.


}