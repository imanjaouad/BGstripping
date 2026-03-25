const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE_PATH = "./livres.json";

/* =========================
   Initialisation du fichier
========================= */
function initFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]", "utf-8");
  }
}

/* =========================
   Lire les livres
========================= */
function readBooks() {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data || "[]");
}

/* =========================
   Écrire les livres
========================= */
function writeBooks(livres) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(livres, null, 2), "utf-8");
}

/* =========================
   ROUTES
========================= */

initFile();

/* GET tous les livres */
app.get("/livres", (req, res) => {
  const livres = readBooks();
  res.status(200).json(livres);
});

/* GET livre par id */
app.get("/livres/:id", (req, res) => {
  const livres = readBooks();
  const id = parseInt(req.params.id);

  const livre = livres.find(l => l.id === id);

  if (!livre) {
    return res.status(404).json({ message: "Livre introuvable" });
  }

  res.status(200).json(livre);
});

/* POST ajouter livre */
app.post("/livres", (req, res) => {
  const livres = readBooks();

  const nouveauLivre = {
    id: livres.length ? livres[livres.length - 1].id + 1 : 1,
    titre: req.body.titre,
    auteur: req.body.auteur
  };

  livres.push(nouveauLivre);
  writeBooks(livres);

  res.status(201).json(nouveauLivre);
});

/* PUT modifier livre */
app.put("/livres/:id", (req, res) => {
  const livres = readBooks();
  const id = parseInt(req.params.id);

  const livre = livres.find(l => l.id === id);

  if (!livre) {
    return res.status(404).json({ message: "Livre introuvable" });
  }

  livre.titre = req.body.titre;
  livre.auteur = req.body.auteur;

  writeBooks(livres);
  res.status(200).json(livre);
});

/* DELETE supprimer livre */
app.delete("/livres/:id", (req, res) => {
  const livres = readBooks();
  const id = parseInt(req.params.id);

  const livreASupprimer = livres.find(l => l.id === id);

  if (!livreASupprimer) {
    return res.status(404).json({
      message: "L'id du livre est introuvable"
    });
  }

  const nouveauxLivres = livres.filter(l => l.id !== id);
  writeBooks(nouveauxLivres);

  res.status(200).json({
    message: "Livre supprimé avec succès",
    livreSupprime: livreASupprimer
  });
});

/* =========================
   Lancement du serveur
========================= */
app.listen(3000, () => {
  console.log("✅ Serveur démarré sur http://localhost:3000");
});
