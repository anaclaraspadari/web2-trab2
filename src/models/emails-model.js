const emailsDAO=require('./emails-dao')

class Email{
    constructor(usuario_id, email, principal){
        this.usuario_id=usuario_id;
        this.email=email;
        this.principal=principal
    }
    static instantRow(email){
        return new Email(email.usuario_id, email.email, parseInt(email.principal))
    }
    // static instanceList(emails, principal, usuario_id){
    //     let emailsObj=[]
    //     if(Array.isArray(emails)){
    //         for(let i=0;i<emails.length;i++){
    //             if(i==principal){
    //                 emailsObj.push(new Email(emails[i],1,usuario_id))
    //             }else{
    //                 emailsObj.push(new Email(emails[i],0,usuario_id))
    //             }
    //         }
    //     }
    // }
    // static insertList(emails, usuario_id){
    //     let emailsDAO=new emailsDAO()
    //     for(let email of emails){
    //         const emailObj=new Email(email.numero, email.principal, usuario_id);
    //         emailsDAO.createEmail(emailObj)
    //     }
    // }
}

module.exports=Email