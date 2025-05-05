const session = require("express-session");
const usersDAO=require("../models/users-dao")
const { compareSync, hashSync } = require("bcrypt");

const usersController={
    getAll: (req,res) => {
        console.log("Iniciando consulta");
        const users=usersDAO.getAll();
        console.log(users);
        return res.render('usersList',{users,session:req.session});
    },
    showLoginPage:(req,res)=>{
        res.render('login');
    },
    login: async (req, res) => {
        const { cpf, senha } = req.body;
        const user = await usersDAO.login(cpf);
        if (!user) {
            return res.render('login', { error: 'Usuário não encontrado', cpf });
        }
        if (user.senha === null) {
            return res.render('login', { error: 'Conta não ativada ou sem senha definida', cpf });
        }
        const senhaValida = compareSync(senha, user.senha);
        if (senhaValida) {
            req.session.user = user;
            console.log("USUARIO AUTENTICADO")
            return res.redirect('/users');
        }
        return res.render('login', { error: 'Senha incorreta', cpf });
    },
    logout:(req,res)=>{
        req.session.destroy();
        res.send("LOGOFF CONCLUIDO");
    },
    getById: (req,res)=>{
        const id=req.params.id;
        const user=usersDAO.getById(id);
        res.json(user)
    },
    showCreateUser:(req,res)=>{
        res.render('createUser');
    },
    createUser: async(req,res)=>{
        console.log({body: req.body})
        const user=req.body;
        user.senha=hash(user.senha,10);
        usersDAO.createUser(user);
        res.send("Adicionando Usuário")
    }
}

module.exports=usersController