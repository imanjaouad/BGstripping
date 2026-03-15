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
function readBooks({
    
})