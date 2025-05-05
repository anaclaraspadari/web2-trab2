const phonesDAO=require('./phones-dao')

class Phone{
    constructor(usuario_id, telefone, principal){
        this.usuario_id=usuario_id;
        this.telefone=telefone;
        this.principal=principal
    }
}

module.exports=Phone