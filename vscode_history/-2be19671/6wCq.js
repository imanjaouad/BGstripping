const express = require('express')

const app= express()

const addition = require("./calcul")

app.listen(3000,()=>{
    console.log("hello");
    console.log(addition(222,111))
})