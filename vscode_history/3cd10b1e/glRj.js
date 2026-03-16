const mongoose = require("mongoose");

const livreShema = new mongoose.Schema({
    titre:String,
    auteur: String,
    prix :Number
})

module.exports = mongoose.model('Livre',LivreShema);

