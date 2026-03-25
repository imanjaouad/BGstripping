const express = require('express')

const app= express()

const {addition,soustraction,multiplication,div} = require("./calcul")


app.listen(3000,()=>{
    console.log("hello");
    console.log(div(222,100))

})