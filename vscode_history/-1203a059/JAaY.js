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


