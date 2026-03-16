const express = require('express');
const data = require('./donnees.json');

const app = express();
app.use(express.json());

let categories = [];

const PORT = 3000;

// GET : Récupérer toutes les catégories
app.get('/categories', (req, res) => {
    const data_categories = [...categories, ...data];
    res.json(data_categories);
});

// POST : Ajouter une catégorie
app.post('/categories/create', (req, res) => {
    categories.push(req.body);
    res.send('Catégorie créée');
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Serveur lancé avec succès sur le port ${PORT}`));
