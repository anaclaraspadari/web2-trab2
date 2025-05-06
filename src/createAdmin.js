const bcrypt = require('bcrypt');
const db = require('./db/database'); // Ajuste o caminho conforme sua estrutura

// Dados do primeiro usuário (ADMIN)
const nome = 'Administrador';
const cpf = '12345678900'; // Altere para um CPF fictício válido
const senha = 'admin123'; // Senha simples apenas para exemplo

// Criptografando a senha
bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) {
        console.error('Erro ao criptografar a senha', err);
        return;
    }

    // Inserir o primeiro usuário
    const query = 'INSERT INTO usuarios (nome, cpf, senha, perfil) VALUES (?, ?, ?, ?)';
    db.run(query, [nome, cpf, hashedPassword, 'ADMIN'], function(err) {
        if (err) {
            console.error('Erro ao adicionar o usuário', err);
        } else {
            console.log('Usuário ADMIN criado com sucesso!');
        }
    });
});
