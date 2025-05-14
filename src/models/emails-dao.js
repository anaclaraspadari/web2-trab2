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
    createEmail(userId, email, princ){
        const query=db.prepare(`INSERT INTO emails(usuario_id,email,principal) VALUES (?,?,?)`)
        return query.run(userId, email, princ ? 1 : 0)
    },
    updateEmail(email){
        const query=db.prepare(`UPDATE emails SET email=?, principal=COALESCE(?, 0) WHERE id=? AND usuario_id=?`)
        return query.run(email.email, email.principal, email.id, email.usuario_id)
    },
    async deleteEmail(id){
        const query=db.prepare(`DELETE FROM emails WHERE id=?`);
        return query.run(id)
    },
    setAllNonPrincipalExcept(usuario_id, exceptEmailId){
        const query=db.prepare('UPDATE emails SET principal=0 WHERE usuario_id=? AND id!=? AND principal=1');
        return query.run(usuario_id, exceptEmailId)
    },
    countEmails(usuario_id){
        const query=db.prepare('SELECT count(*) FROM emails WHERE usuario_id=?');
        return query.get(usuario_id)
    },
    setPrincipal(id){
        const query=db.prepare('UPDATE emails SET principal=1 WHERE id=?')
        return query.run(id)
    }
}

module.exports=emailsDAO