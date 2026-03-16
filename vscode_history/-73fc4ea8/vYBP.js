const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports=(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res
    }
}