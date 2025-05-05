const emailsDAO=require('./emails-dao')

class Email{
    constructor(usuario_id, email, principal){
        this.usuario_id=usuario_id;
        this.email=email;
        this.principal=principal
    }
}

module.exports=Email