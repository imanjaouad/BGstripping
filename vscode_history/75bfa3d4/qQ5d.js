const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
app.use(express.json());

const SECRET_KEY= "secret123";
const USERS_FILE= "./users.json";

