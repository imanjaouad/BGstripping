
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const FILE_PATH = "./books.json";

/* =====================================================
 Fonctions utilitaires (FACTORISATION)
===================================================== */

// Initialiser le fichier JSON

function initFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]");
  }
}

// Lire les livres :
function readBooks(res) {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    res.status(500).json({ message: "erreur du lecture du fichier !" });
    return null;
  }
} // Écrire les livres
function writeBooks(res, books) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    res.status(500).json({ message: "Erreur d’écriture du fichier" });
    return false;
  }
}

// Initialisation
initFile();

/* =====================================================
 GET – Récupérer tous les livres
===================================================== */

app.get("/books", (req, res) => {
  const books = readBooks(res);
  if (books) res.status(200).json(books);
});

/* =====================================================
 POST – Ajouter un livre
===================================================== */

app.post("/books", (req, res) => {
  const books = readBooks(res);
  if (!books) return;

  const newBook = {
    id: books.length + 1,
    title: books.body.title,
    author: req.body.author,
    price: req.body.price,
  };

  books.push(newBook);

  if (writeBooks(res, books)) {
    res.status(201).json(newBook);
  }
});

/* =====================================================
 PUT – Modifier un livre
===================================================== */

app.put("/books/:id", (req, res) => {
  const books = readBooks(res);
  if (!books) return;
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }
  book.title = req.body.title;
  book.author = req.body.author;
  book.price = req.body.price;
  if (writeBooks(res, books)) {
    res.status(200).json(book);
  }
});
/* =====================================================
 DELETE – Supprimer un livre
===================================================== */
app.delete("/books/:id", (req, res) => {
  const books = readBooks(res);
  if (!books) return;
  const id = parseInt(req.params.id);
  const newBooks = books.filter((b) => b.id !== id);
  if (books.length === newBooks.length) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }
  if (writeBooks(res, newBooks)) {
    res.status(200).json({ message: "Livre supprimé avec succès" });
  }
});
/* =====================================================
 Lancement du serveur
===================================================== */
app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
