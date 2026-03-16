const express = require("express");

const fs =require("fs");

const jwt =require("jsonwebtoken");

const bcrypt = require("bcryptjs");

require("dotenv").config();


const authMiddleware = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");


const app = express();
app.use (express.json());

const USERS_FILE="./users/json";
const ARTICLES_FILE = "./articles.json";


// files : 

const read

