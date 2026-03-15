// Import des modules :
const express = require("express");
const axios = require("axios");
require("dotenv").config();

// application express
const app = express();

// 3️⃣ middleware pour lire les données json :
app.use(express.json());

// confiuration de axios :
const gitlabAPI = axios.create({
  baseURL: "https://gitlab.com/api/v4",
  headers: {
    "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
  },
});


// route get projects :
app.get("/", (req, res) => {
  res.json({ message: "API GitLab active" });
});

app.get("/projects", async (req, res) => {
  try {
    const response = await gitlabAPI.get("/projects?owned=true");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({error: "Erreur lors de la récupération des projets"});
  }
});


app.post("/projects", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({error: "Le nom du projet est obligatoire"});
    }

    const response = await gitlabAPI.post("/projects", {
      name: name,
      visibility: "private",
    });

    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({error: "Erreur lors de la création du projet"});
  }
});



