const express = require('express');
const session = require('express-session');  // Importando o express-session
const bcrypt = require('bcrypt'); // Para validar a senha
const db = require('./db/database'); // Acessando a base de dados
const app = express();
const userRoutes = require('./routes/user');

// Configurando o Express para usar EJS e JSON
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // Para pegar os dados do formulário
app.use(express.json()); // Para APIs que recebem JSON
app.use(userRoutes);

// Configuração da sessão
app.use(session({
    secret: 'seu_segredo_aqui',  // Pode mudar para algo mais seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Se estiver usando HTTPS, altere para true
}));

// Rota de login
app.get('/login', (req, res) => {
    res.render('login');  // Renderizando a página de login (crie o arquivo de login.ejs)
});

app.post('/login', (req, res) => {
    const { cpf, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE cpf = ?';
    db.get(query, [cpf], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário', err);
            return res.status(500).send('Erro interno');
        }
        
        if (!user) {
            return res.status(400).send('Usuário não encontrado');
        }

        // Verificando a senha
        bcrypt.compare(senha, user.senha, (err, result) => {
            if (err || !result) {
                return res.status(400).send('Senha incorreta');
            }

            // Autenticando e criando a sessão
            req.session.user = user;
            return res.redirect('/dashboard');  // Direcionando para a página principal
        });
    });
});

// Rota de dashboard (apenas para autenticados)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');  // Redireciona para o login se não estiver autenticado
    }

    res.render('dashboard', { user: req.session.user });  // Renderizando a página principal
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao encerrar a sessão');
        }
        res.redirect('/login');
    });
});

// Inicializando o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
