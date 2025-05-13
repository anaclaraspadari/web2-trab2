const phonesDAO=require('./phones-dao')

class Phone{
    constructor(usuario_id, telefone, principal){
        this.usuario_id=usuario_id;
        this.telefone=telefone;
        this.principal=principal
    }
    static instantRow(phone){
        return new Phone(phone.usuario_id, phone.telefone, parseInt(phone.principal))
    }
    // static instanceList(telefones, principal, usuario_id){
    //     let telefonesObj=[]
    //     if(Array.isArray(telefones)){
    //         for(let i=0;i<telefones.length;i++){
    //             if(i==principal){
    //                 telefonesObj.push(new Phone(telefones[i],1,usuario_id))
    //             }else{
    //                 telefonesObj.push(new Phone(telefones[i],0,usuario_id))
    //             }
    //         }
    //     }
    // }
    // static insertList(telefones, usuario_id){
    //     let phonesDAO=new phonesDAO()
    //     for(let telefone of telefones){
    //         const telefoneObj=new Phone(telefone.numero, telefone.principal, usuario_id);
    //         phonesDAO.createPhone(telefoneObj)
    //     }
    // }
}

module.exports=Phone