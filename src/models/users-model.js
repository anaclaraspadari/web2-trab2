const usersDAO=require('./users-dao')
class User{
    constructor(id, nome, cpf, senha, perfil, telefones, emails){
        this.id=id;
        this.nome=nome;
        this.cpf=cpf;
        this.senha=senha;
        this.perfil=perfil;
        this.telefonePrincipal;
        this.emailPrincipal;
        this.telefones=telefones;
        this.emails=emails;
    }
    static instanceRow(user){
        return new User(user.id, user.nome, user.cpf, user.senha, user.perfil, user.telefonePrincipal, user.emailPrincipal, user.telefones, user.emails)
    }
    verificaTelefonePrincipal(){
        let c=0;
        for (let telefone of this.telefones) if (telefone.principal == 1) c++
        if (c > 1) return { message: 'Só é possível ter um Telefone principal', exists: false }
        else if (c == 0 && this.telefones.length > 0) return { message: 'É necessário ao menos um Telefone principal', exists: false }
        return { message: null, exists: true }
    }
    verificaEmailPrincipal(){
        let c=0;
        for (let email of this.emails) if (email.principal == 1) c++
        if (c > 1) return { message: 'Só é possível ter um Telefone principal', exists: false }
        else if (c == 0 && this.emails.length > 0) return { message: 'É necessário ao menos um Telefone principal', exists: false }
        return { message: null, exists: true }
    }
}

module.exports=User;