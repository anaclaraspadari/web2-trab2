import {db} from "../db/database"

class emailsDAO{
    async getById(id){
        const query=db.prepare(`SELECT * FROM emails WHERE id=?`)
        return query.get(id)
    }
    async getByUser(usuario_id){
        const query=db.prepare(`SELECT * FROM emails WHERE usuario_id=?`)
        return query.all(usuario_id)
    }
    async getByEmail(email){
        const query=db.prepare(`SELECT * FROM emails WHERE email=?`)
        return query.get(email)
    }
}

export{
    emailsDAO
}