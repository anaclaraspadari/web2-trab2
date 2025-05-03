-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    perfil TEXT NOT NULL CHECK (perfil IN ('ADMIN', 'CLIENTE')) DEFAULT 'CLIENTE'
);

-- Tabela de telefones
CREATE TABLE IF NOT EXISTS telefones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    telefone TEXT NOT NULL,
    principal BOOLEAN DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de emails
CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    principal BOOLEAN DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
