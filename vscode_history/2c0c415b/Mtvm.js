const http = require('http')

function addition(a,b){
    return a + b;
}

function sub(a,b){
    return a - b;


}

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/plain'})

    const message = 'la somme de ${a} et ${b} : '+addition(2020,6)+"\nLa soustraction de 2020 et 4: "+sub(2020,6);

    res.end(message)
});

server.listen(3000,()=>{
    console.log("server demmare sur le port 3000")
});

