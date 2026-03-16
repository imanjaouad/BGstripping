const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const FILE_PATH = "./livres.json";

// Initialisation du fichier si inexistant
function initFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]");
  }
}

// Lire les livres depuis le fichier
function readBooks() {
  initFile();
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Écrire les livres dans le fichier
function writeBooks(livres) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(livres, null, 2));
}

// Supprimer un livre
app.delete("/livres/:id", (req, res) => {
  const livres = readBooks();
  const id = parseInt(req.params.id);

  // Trouver le livre à supprimer
  const livreASupprimer = livres.find((l) => l.id === id);
  if (!livreASupprimer) {
    return res.status(404).json({ message: "L'id du livre que vous avez tapé est introuvable !" });
  }

  // Filtrer pour supprimer le livre
  const nouveauxLivres = livres.filter((l) => l.id !== id);
  writeBooks(nouveauxLivres);

  // Réponse avec confirmation et infos du livre supprimé
  res.status(200).json({
    message: "CONFIRMATION: Attention, tu es en train de supprimer un livre peut-être important pour toi !",
    livreSupprime: livreASupprimer
  });
});

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
