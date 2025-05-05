const db=require("../db/database")

console.log("Carregou DAO dos emails")

const emailsDAO={
    getByUser(usuario_id){
        console.log("Iniciando a consulta de emails por usuario")
        const query=db.prepare('SELECT * FROM emails WHERE usuario_id=?');
        console.log(query)
        return query.all(usuario_id)
    },
    getById(id){
        const query=db.prepare(`SELECT * FROM emails WHERE id=?`)
        return query.get(id)
    },
    getEmailPrincipal(usuario_id){
        const query=db.prepare(`SELECT * FROM emails WHERE usuario_id=? and principal=1`)
        return query.get(usuario_id)
    },
    createEmail(email){
        const query=db.prepare(`INSERT INTO emails(usuario_id,email,principal) VALUES (?,?,?)`)
        return query.run(email.usuario_id, email.email, email.principal)
    },
    updateEmail(usuario_id,email){
        const query=db.prepare(`UPDATE emails SET email=?, principal=?  WHERE usuario_id=?`)
        return query.run(email.email, email.principal, usuario_id)
    },
    deleteEmail(id){
        const query=db.prepare(`DELETE FROM emails WHERE id=?`);
        return query.run(id)
    }
}

module.exports=emailsDAO