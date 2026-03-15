const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.use(express.json());

// connexion et création de la base de données tp_api
mongoose.connect("mongodb://127.0.0.1:27017/tp_api")
  .then(() => {
    console.log("mongodb connecté avec succès");
  })

  .catch((error) => {
    console.log("erreur de connexion mongodb", erreur);
  });

  // Importation du modèle User
const User = require("./models/User");

//Route post pour ajouter un user :
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

//Route get pour recuperer tous les users :
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//Route get by id pour recuperer un user avec id :
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "user introuvable !" });
  } catch (erreur) {
    res.status(404).json({ message: " ce id est introuvable" });
  }
  res.json(user);
});

//Route put pour modifier un user avec son id :
app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
});

//Route delete pour supprimer un user avc son id :
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "user supprimé avec succès !" });
});


app.listen(3000, () => {
  console.log("serveur demarré sur http://localhost:3000");
});
