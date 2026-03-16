const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const FILE_PATH = "./livres.json";

function initFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]");
  }
}

function readBooks(res) {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    res.status(500).json({ message: "erreur de lecture du fichier !" });
    return null;
  }
}

function writeBooks(res, livres) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(livres, null, 2));
    return true;
  } catch (error) {
    res.status(500).json({ message: "Erreur d’écriture du fichier" });
    return false;
  }
}

initFile();

app.get("/livres", (req, res) => {
  const livres = readBooks(res);
  if (livres) res.status(200).json(livres);
});

app.get("/livres/:id", (req, res) => {
  const livres = readBooks(res);

  const id = parseInt(req.params.id);
  const livre = livres.find((l) => l.id === id);

  if (!livre) {
    return res.status(500).json({ message: "Echec de trouver ce livre ! " });
  }

  res.json(livre);
});

app.post("/livres", (req, res) => {
  const livres = readBooks(res);

  const nouveauLivre = {
    id: livres.length + 1,
    titre: req.body.titre,
    auteur: req.body.auteur,
  };

  livres.push(nouveauLivre);

  if (writeBooks(res, livres)) {
    res.status(201).json(nouveauLivre);
  }
});

app.put("/livres/:id", (req, res) => {
  const livres = readBooks(res);

  const id = parseInt(req.params.id);
  const livre = livres.find((l) => l.id === id);

  if (!livre) {
    return res.status(500).json({ message: "Le livre est introuvable" });
  }

  livre.titre = req.body.titre;
  livre.auteur = req.body.auteur;

  if (writeBooks(res, livres)) {
    res.status(201).json(livre);
  }
});

app.delete("/livres/:id", (req, res) => {
  const livres = readBooks(res); // ajouter res pour gérer erreur

  if (!livres) return; // si lecture échoue, on stoppe

  const id = parseInt(req.params.id);

  const existe = livres.some((l) => l.id === id);
  if (!existe) {
    return res.status(404).json({ message: "L'id du livre que vous avez tapé est introuvable !" });
  }

  const nouveauxLivres = livres.filter((l) => l.id !== id);

  if (!writeBooks(res, nouveauxLivres)) return; // si écriture échoue, on stoppe

  res.status(200).json({
    message: "CONFIRMATION: Attention, tu es en train de supprimer un livre peut-être important pour toi !"
  });
});


app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});

