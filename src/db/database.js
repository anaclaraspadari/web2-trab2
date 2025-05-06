const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');

// Verificar se o banco de dados já existe
const dbExists = fs.existsSync(dbPath);

// Conectar ou criar o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

// Criar as tabelas se o banco não existir
if (!dbExists) {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Erro ao criar tabelas:', err);
        } else {
            console.log('Tabelas criadas com sucesso!');
        }
    });
}

module.exports = db;
