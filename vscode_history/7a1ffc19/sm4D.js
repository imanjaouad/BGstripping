const express = require('express'); 
const app = express(); 
const PORT = process.env.PORT || 3000; 
// Middleware pour parser le JSON
app.use(express.json()); 
// Base de données en mémoire (simple tableau)
let tasks = [ 
 { id: 1, title: 'Apprendre Docker', completed: false }, 
 { id: 2, title: 'Créer une API Node.js', completed: true }, 
 { id: 3, title: 'Déployer sur le cloud', completed: false } 
]; 
// Variable pour générer les IDs
let nextId = 4; 
// ==================== ROUTES ====================
// Page d'accueil
app.get('/', (req, res) => { 
 res.send(`
 <!DOCTYPE html>
 <html lang="fr">
 <head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Todo API</title>
 <style>
 body {
 font-family: 'Segoe UI', Arial, sans-serif;
 max-width: 800px;
 margin: 50px auto;
 padding: 20px;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
 color: white;
 }
 .container {
 background: rgba(255, 255, 255, 0.1);
 padding: 40px;
 border-radius: 15px;
 backdrop-filter: blur(10px);
 }
 h1 { text-align: center; margin-bottom: 30px; }
 .endpoint {
 background: rgba(255, 255, 255, 0.2);
 padding: 15px;
 margin: 10px 0;
 border-radius: 8px;
 font-family: 'Courier New', monospace;
 }
 .method {
 display: inline-block;
 padding: 5px 10px;
 border-radius: 5px;
 font-weight: bold;
 margin-right: 10px;
 }
 .get { background: #28a745; }