const http = require('http')

function addition(a,b){
    return a + b;
}

function sub(a,b){
    return a - b;


}

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/plain'})

    const message = 'la somme de 2020 et 6 : '+addition(2020,6)+"\n"
})