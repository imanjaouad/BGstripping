const express = require("express");

const fs =require("fs");

const jwt =require("jsonwebtoken");

const bcrypt = require("bcryptjs");

require("dotenv").config();


const authMiddleware = require("./middleware/authMiddleware");
const authMiddleware = require("./middleware/authMiddleware");

