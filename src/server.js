const express = require('express')
const app=express()

app.get('/', (req, res) => {
    res.send("OI DO SERVIDOR!!!");
});

app.listen(3000, (err) => {
    if (err) {
        console.log('Erro ao iniciar o serviço!');
        return;
    }
    console.log("Service iniciado na porta 3000");
});