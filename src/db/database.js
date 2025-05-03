const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');
const db = new sqlite3.Database(dbFile);

const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema, (err) => {
  if (err) {
    console.error('Erro ao criar estrutura do banco:', err.message);
  } else {
    console.log('Banco de dados inicializado com sucesso.');
  }
});

module.exports = db;
