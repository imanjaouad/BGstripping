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

const readData = (donnes) ? JSON.parse(fs.readFileSync(donnes)):[];

const writeData = (donnes,data)=>{
    fs.writeFileSync(fileURLToPath,JSON.stringify(data,null,2))



    app.post("/register",async (req,res)=>{
        const {email,password,role="user"} = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "Champs obligatoirs !" });
        }
        if (password.length<8){
            return res.status(400).json({ message: "MDP doit contenir au moins 8 caracteres !" });
            
        }
    })
}



