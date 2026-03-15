const http = require('http')

function addition(a,b){
    return a + b;
}

function sub(a,b){
    return a - b;


}

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/html'})

    const message = `<h1>la somme de a et b : '${addition(2020,6)}+"\nLa soustraction de 2020 et 4: "${sub(2020,6)};

    res.end(message)</h1>`
});

server.listen(3000,()=>{
    console.log("server demmare sur le port 3000")
});

