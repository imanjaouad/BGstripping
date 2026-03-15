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
    if(!authHeader) return res.status(404).json({message : "token manquant !"});

    // extraction du token pour supprimer le préfix bearer : 
    const token = authHeader.split("")[1];

    // tentative de vérification du token :
    try{
        // Vérification et décodage du token avec la clé secrète
        // Si le token est valide, decoded contiendra le payload (données utilisateur)
        const decoded = jwt.verify(token,SECRET_KEY);
        // Ajout des informations utilisateur décodées à l'objet req
        // Ces données seront accessibles dans les routes protégées via req.user
        req.user = decoded;
        // passage au middleware route suivant :
        next();

    }catch(error){
        // Si le token est invalide, expiré ou mal formé, renvoyer une erreur 401 (Unauthorized)
        res.status(404).json({message : "token invalide !"});


    }
}

// ========================================
// Export du middleware
// ========================================
// Permet d'utiliser ce middleware dans d'autres fichiers

