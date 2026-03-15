2.3 Service Commandes (2 pts) 
Endpoints obligatoires :
POST /api/orders - Création d'une commande 
GET /api/orders/:id - Détails d'une commande 
GET /api/orders/user/:userId - Commandes d'un utilisateur 
PUT /api/orders/:id/status - Mise à jour du statut 
Données à gérer :
 id, userId, produits[], montant total, statut (en attente/confirmée/expédiée/livrée), date