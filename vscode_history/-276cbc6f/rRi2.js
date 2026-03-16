// importation des modules nécessaires :
const jwt = require("jsonwebtoken");

// constantes de configuration :
const SECRET_KEY =  "secret123";

// middleware d'authentification :
/**
 * Vérifie la validité du token JWT dans les requêtes HTTP
 * Ce middleware protège les routes nécessitant une authentification
 * 
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
function authMiddleware (req,res,next){
    const authHeader = req.headers.authorization;

    // vérification de présence de l'entete authorization :
    if(!authHeader)
}
