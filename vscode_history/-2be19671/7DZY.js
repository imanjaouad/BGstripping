const express = require('express')

const app= express()

const addition = require("./calcul")
const div = require("./calcul")


app.listen(3000,()=>{
    console.log("hello");
    console.log(addition(222,77))
    console.log(div(222,0))

})