const usersDAO=require('./users-dao')
class User{
    constructor(id, nome, cpf, senha, perfil){
        this.id=id;
        this.nome=nome;
        this.cpf=cpf;
        this.senha=senha;
        this.perfil=perfil;
    }
}

module.exports=User;