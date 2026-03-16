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
    fs.writeFileSync(FILE_PATH, "[]");
  }
}

/* =========================
   Lire les livres
========================= */
function readBooks(res) {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la lecture du fichier" });
    return [];
  }
}

/* =========================
   Écrire les livres
========================= */
function writeBooks(livres, res) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(livres, null, 2));
    return true;
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'écriture du fichier" });
    return false;
  }
}

/* =========================
   DELETE : supprimer un livre
========================= */
app.delete("/livres/:id", (req, res) => {
  const livres = readBooks(res);
  const id = parseInt(req.params.id);

  const livreASupprimer = livres.find(l => l.id === id);

  if (!livreASupprimer) {
    return res.status(404).json({
      message: "L'id du livre que vous avez tapé est introuvable !"
    });
  }

  const nouveauxLivres = livres.filter(l => l.id !== id);

  writeBooks(nouveauxLivres, res);

  res.status(200).json({
    message: "CONFIRMATION : Livre supprimé avec succès !",
    livreSupprime: livreASupprimer
  });
});

/* =========================
   Lancement du serveur
========================= */
initFile();

app.listen(3000, () => {
  console.log("✅ Serveur lancé sur http://localhost:3000");
});
