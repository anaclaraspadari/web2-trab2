const db=require("../db/database")

console.log("Carregou DAO");

const usersDAO={
    getAll() {
        console.log("Iniciando a consulta de usuarios: ");
        const query = db.prepare('SELECT * FROM usuarios;');
        console.log(query)
        return query.all();
    },
    getById(id){
        const query=db.prepare(`SELECT * FROM usuarios WHERE id=?`)
        return query.get(id)
    },
    createUser(user){
        const query=db.prepare(`INSERT INTO usuarios(cpf, nome, senha, perfil) VALUES (?,?,?,?)`)
        return query.run(user.cpf, user.nome, user.senha, user.perfil)
    },
    updateUser(user){
        const query=db.prepare(`UPDATE usuarios SET nome=?, senha=? WHERE id=?`)
        return query.run(user.nome, user.senha, user.id)
    },
    deleteUser(id){
        const query=db.prepare(`DELETE FROM usuarios WHERE id=?`)
        return query.run(id)
    },
    login(cpf){
        const query=db.prepare(`SELECT * FROM usuarios WHERE cpf=? LIMIT 1`);
        return query.get(cpf)
    }
}

module.exports=usersDAO;