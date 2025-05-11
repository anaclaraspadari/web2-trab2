const usersDAO=require("../models/users-dao")
const phonesDAO=require("../models/phones-dao")
const emailsDAO=require("../models/emails-dao")
const User=require('../models/users-model')
const Phone=require('../models/phones-model')
const Email=require('../models/users-model')
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
        const user = usersDAO.login(cpf);
        if (!user) {
            return res.render('login', { error: 'Usuário não encontrado', cpf });
        }
        if (user.senha === null) {
            return res.render('login', { error: 'Conta não ativada ou sem senha definida', cpf });
        }
        const senhaValida = compareSync(senha, user.senha);
        if (senhaValida) {
            req.session.user = user;
            req.session.isAuth = true;
            console.log("USUARIO AUTENTICADO")
            return res.redirect('/users');
        }
        return res.render('login', { error: 'Senha incorreta', cpf });
    },
    logout:(req,res)=>{
        req.session.destroy();
        res.send("LOGOUT CONCLUIDO");
        return res.redirect('/login')
    },
    getById: (req,res)=>{
        const id=req.params.id;
        const user=usersDAO.getById(id);
        const telefones=phonesDAO.getByUser(id);
        const emails=emailsDAO.getByUser(id);
        user.telefones=telefones;
        user.emails=emails;
        const usuarioLogado=req.session.user;
        res.render('userDetails',{user, usuarioLogado, id})
    },
    showCreateUser:(req,res)=>{
        res.render('createUser');
    },
    createUser: async(req,res)=>{
        const user=req.body;
        console.log(user.phonePrincipal)
        user.senha=hashSync(user.senha,10);
        usersDAO.createUser(user);
        let usuarioId=usersDAO.getByCPF(user.cpf)
        console.log(usuarioId)
        const novoPhone=phonesDAO.createPhone(usuarioId.id, user.phonePrincipal, 1)
        const novoEmail=emailsDAO.createEmail(usuarioId.id, user.emailPrincipal, 1)
        res.send("Adicionando Usuário")
        return res.redirect('/users')
    },
    showUpdateUser:(req,res)=>{
        const id=req.params.id;
        const usuarioLogado=req.session.user;
        req.session.isAuth=true;

        const user=usersDAO.getById(id);
        if(!user){
            return res.status(404).send("Usuário não encontrado")
        }
        res.render('updateUser',{data:{user, usuarioLogado, id}})
    },
    updateUser:(req,res)=>{
        const id=req.params.id;
        const usuarioLogado=req.session.user;
        const antigo=usersDAO.getById(id);
        req.session.isAuth=true;
        if(!antigo){
            return res.status(404).send('Usuário não encontrado');
        }
        if(usuarioLogado.perfil!=='ADMIN' && usuarioLogado.id!==parseInt(id)){
            return res.status(403).send('Permissão negada: você não pode editar esse usuário');
        }
        const att=User.instanceRow(req.body);
        att.id=id;
        att.cpf=antigo.cpf;
        att.perfil=antigo.perfil;
        usersDAO.updateUser(att);
        return res.redirect('/users')
    },
    deleteUser:(req,res)=>{
        const {id}=req.params;
        const usuarioLogado=req.session.user;
        const user=usersDAO.getById(id);
        req.session.isAuth=true;
        if(!user){
            return res.status(404).send('Usuário não encontrado');
        }
        if(usuarioLogado.perfil!=='ADMIN'){
            return res.status(403).send('Permissão negada: você não pode editar esse usuário');
        }
        usersDAO.deleteUser(id);
        if(usuarioLogado.id==id){
            logout(req,res)
        }
        return res.redirect('/users')
    }
}

module.exports=usersController