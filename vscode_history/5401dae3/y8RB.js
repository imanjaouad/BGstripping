const express = require('express');
const data = require('./donnees.json'); // Vérifie bien le nom et l'extension

const app = express();
app.use(express.json());

let categories = [];

const PORT = 3000;

console.log('Données initiales :', data); // Doit afficher un tableau
console.log('Type de data :', typeof data); // Doit afficher 'object'

app.get('/categories', (req, res) => {
    if (!Array.isArray(data)) {
        return res.status(500).send('Erreur : données invalides');
    }
    const data_categories = [...categories, ...data];
    res.json(data_categories);
});

app.post('/categories/create', (req, res) => {
    categories.push(req.body);
    res.send('Catégorie créée');
});

app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
