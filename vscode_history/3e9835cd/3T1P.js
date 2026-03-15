const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 
 nom: String, // Nom de l’utilisateur 
 email: String, // Email 
 age: Number // Âge 
});

// Exportation du modèle User 
// MongoDB créera automatiquement une collection "users" 
module.exports = mongoose.model('User', userSchema);

