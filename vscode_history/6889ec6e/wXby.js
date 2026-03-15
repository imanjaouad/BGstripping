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

        const users = readData(USERS_FILE);
        const exits = users.find((u)=> u.email === email)

        if (exists){
            return res.status(400).json({ message: "utilisateur deja existe !" });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        users.push({email,password : hashedPassword,role})

        writeData(USERS_FILE,users);
        return res.status(400).json({ message: "utilisateur crée !" });



    })

    app.post("/login", async(req,res)=>{
        const {email,password} = req.body;

        const users = readData(USERS_FILE);
        
        const user = users.find((u)=> u.email === email);
        if(!user){
            return res.status(400).json({ message: "les donnees invalides !" });
        }
        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(400).json({ message: "les donnees invalides !" });
        }

        const token = jwt.sign({email : user.email, role : user.role},process.env.SECRET_KEY,{expiresIn : "10m"})
        res.json({token});

    })

    app.get("/articles",authMiddleware,(req,res)=>{
        const articles = fs.readData(USERS_FILE);
        res.json(articles);
    })

    app.post("/articles",authMiddleware,checkRole("admin"),(req,res)=>{
        const {title , content }= req.body;
        const articles = readData(ARTICLES_FILE);

        articles.push({
            id : articles.length + 1,
            title,
            content,
            author : req.user.email
        })

        writeData(ARTICLES_FILE,articles);
        res.status(201).json({ message: "Article créé" });

    })

    app.delete("/users/:email",authMiddleware,checkRole("admin"),(req,res)=>{
        const users = readData(USERS_FILE);
        const users_filter = users.filter((u)=>u.email !== req.params.email);
        
        writeData(USERS_FILE,users_filter);
        res.status(201).json({ message: "utilisateur supprimé avec succès !" });
    })

    app.listen(3000,()=>{
        console.log(" server lancé sur le port 3000 lien : http://localhost:3000")
    })
};


