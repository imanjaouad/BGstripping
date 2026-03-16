// 1Importer les modules
const express = require("express");
const axios = require("axios");
require("dotenv").config();

// 2️⃣ Créer l'application Express
const app = express();

// 3️⃣ Middleware pour lire le JSON
app.use(express.json());

// 4️⃣ Configurer Axios pour GitLab
const gitlabAPI = axios.create({
  baseURL: "https://gitlab.com/api/v4",
  headers: {
    "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
  },
});

