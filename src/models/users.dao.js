import {db} from "../db/database"

class usersDAO{
    getAll(){
        const query=db.prepare('SELECT * FROM usuarios')
        return query.all()
    }
    getById(id){
        const query=db.prepare(`SELECT * FROM usuarios WHERE id=?`)
        return query.get(id)
    }
    createUser(user){
        const query=db.prepare(`INSERT INTO usuarios(cpf, nome, senha, perfil) VALUES (?,?,?,?)`)
        return query.run(user.cpf, user.nome, user.senha, user.perfil)
    }
    updateUser(user){
        const query=db.prepare(`UPDATE usuarios SET nome=?, senha=? WHERE id=?`)
        return query.run(user.nome, user.senha, user.id)
    }
    deleteUser(id){
        const query=db.prepare(`DELETE FROM usuarios WHERE id=?`)
        return query.run(id)
    }
}

export{
    usersDAO
}