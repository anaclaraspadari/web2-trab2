const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database');

// Página de login (formulário)
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Processa login
router.post('/login', (req, res) => {
    const { cpf, senha } = req.body;

    db.get('SELECT * FROM usuarios WHERE cpf = ?', [cpf], async (err, user) => {
        if (err) return res.render('login', { error: 'Erro ao acessar o banco de dados.' });
        if (!user) return res.render('login', { error: 'Usuário não encontrado.' });

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) return res.render('login', { error: 'Senha incorreta.' });

        req.session.user = {
            id: user.id,
            nome: user.nome,
            perfil: user.perfil
        };

        res.redirect('/users');
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
