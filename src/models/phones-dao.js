const db=require("../db/database")

console.log("Carregou DAO dos telefones")

const phonesDAO={
    getByUser(usuario_id){
        console.log("Iniciando a consulta de telefones por usuario")
        const query=db.prepare('SELECT * FROM telefones WHERE usuario_id=?');
        console.log(query)
        return query.all(usuario_id)
    },
    getById(id){
        const query=db.prepare(`SELECT * FROM telefones WHERE id=?`)
        return query.get(id)
    },
    getPhonePrincipal(usuario_id){
        const query=db.prepare(`SELECT * FROM telefones WHERE usuario_id=? and principal=1`)
        return query.get(usuario_id)
    },
    createPhone(userId, phone, princ){
        const query=db.prepare(`INSERT INTO telefones(usuario_id,telefone,principal) VALUES (?,?,?)`)
        return query.run(userId, phone, princ)
    },
    updatePhone(phone){
        const query=db.prepare(`UPDATE telefones SET telefone=?, principal=COALESCE(?, 0) WHERE id=? AND usuario_id=?`)
        return query.run(phone.telefone, phone.principal, phone.id, phone.usuario_id)
    },
    deletePhone(id){
        const query=db.prepare(`DELETE FROM telefones WHERE id=?`);
        return query.run(id)
    },
    countPhones(usuario_id){
        const query=db.prepare('SELECT count(*) FROM telefones WHERE usuario_id=?');
        return query.get(usuario_id)
    },
    setPrincipal(id){
        const query=db.prepare('UPDATE telefones SET principal=1 WHERE id=?')
        return query.run(id)
    }
}

module.exports=phonesDAO