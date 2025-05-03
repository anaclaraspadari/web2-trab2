// const sqlite3 = require('sqlite3').verbose();
const sqlite3=require('better-sqlite3')

// const dbFile = path.join(__dirname, 'database.sqlite');
// const schemaPath = path.join(__dirname, 'schema.sql');
// const db = new sqlite3.Database(dbFile);

// const schema = fs.readFileSync(schemaPath, 'utf8');
// db.exec(schema, (err) => {
//   if (err) {
//     console.error('Erro ao criar estrutura do banco:', err.message);
//   } else {
//     console.log('Banco de dados inicializado com sucesso.');
//   }
// });

// module.exports = {db};
const db = new sqlite3('dados.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL CHECK (perfil IN ('ADMIN', 'CLIENTE'))
  );

  CREATE TABLE IF NOT EXISTS telefones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      telefone TEXT NOT NULL,
      principal INTEGER DEFAULT 0,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      email TEXT NOT NULL,
      principal INTEGER DEFAULT 0,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

`)

module.exports={db};
