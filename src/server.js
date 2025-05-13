const express = require('express')
const session=require('express-session')
const app=express()

app.get('/', (req, res) => {
    res.send("OI DO SERVIDOR!!!");
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'keyboard-cat',
    resave: false,      
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const usersRouter = require('./routes/users-routes');
app.use(usersRouter);

app.listen(3000, (err) => {
    if (err) {
        console.log('Erro ao iniciar o serviço!');
        return;
    }
    console.log("Server iniciado na porta 3000");
});