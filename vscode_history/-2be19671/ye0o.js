const express = require('express')

const app= express()

const {addition,soustraction,multiplication,div} = require("./calcul")


app.listen(3000,()=>{
    console.log("hello");
    console.log(div(100,6))
    console.log(soustraction(100,6))
    console.log(multiplication(100,6))
    console.log(addition(100,6))


})