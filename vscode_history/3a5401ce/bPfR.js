const mongoose = require("mongoose");
const express = require("express");

const app = express();


app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/tp_api')
.then(()=>{console.log("mongodb connecté avec succès"))


