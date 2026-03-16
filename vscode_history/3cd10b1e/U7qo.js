const mongoose = require("mongoose");

const LivreShema = new mongoose.Schema({
    titre:String,
    auteur: String,
    prix :Number
})

module.exports = mongoose.model('ouvrage',LivreShema);

