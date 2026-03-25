const http = require('http');

function addition(a,b){
    return a + b;
}

function sub(a,b){
    return a - b;
}

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'});

    const message = `<h1>
La somme de 2020 et 6 : ${addition(2020,6)}<br>
La soustraction de 2020 et 6 : ${sub(2020,6)}
</h1>`;

    res.end(message);
});

server.listen(3000,()=>{
    console.log("Server démarré sur le port 3000");
});
