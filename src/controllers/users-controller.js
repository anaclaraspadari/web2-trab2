const usersDAO=require("../models/users-dao")
const phonesDAO=require("../models/phones-dao")
const emailsDAO=require("../models/emails-dao")
const User=require('../models/users-model')
const Phone=require('../models/phones-model')
const Email=require('../models/users-model')
const { compareSync, hashSync } = require("bcrypt");
const db=require("../db/database");

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
        user.senha=hashSync(user.senha,10);
        usersDAO.createUser(user);
        let usuarioId=usersDAO.getByCPF(user.cpf)
        const novoPhone=phonesDAO.createPhone(usuarioId.id, user.phonePrincipal, 1)
        const novoEmail=emailsDAO.createEmail(usuarioId.id, user.emailPrincipal, 1)
        return res.redirect('/users')
    },
    showCreateEmail:(req,res)=>{
        const usuarioLogado=req.session.user;
        req.session.isAuth=true;
        const id=req.params.id;
        res.render('createEmail',{data:{usuarioLogado, id}})
    },
    createEmail: async(req,res)=>{
        try {
            const usuarioLogado=req.session.user;
            req.session.isAuth=true;
            if(usuarioLogado.perfil!=='ADMIN' && usuarioLogado.id!==parseInt(id)){
                return res.status(403).send('Permissão negada: você não pode inserir dados para este usuário');
            }
            const userId = req.params.id;
            const user = usersDAO.getById(userId);
            const email = req.body;
            const isPrincipal = parseInt(email.principal) === 1;
            const existingPrincipal = emailsDAO.getEmailPrincipal(user.id);
            console.log('Creating email for user:', userId);
            console.log('Email data:', email);
            console.log('Is principal:', isPrincipal);
            console.log('Existing principal email:', existingPrincipal);
            emailsDAO.createEmail(user.id, email.email, isPrincipal);
            if (isPrincipal && existingPrincipal) {
                emailsDAO.updateEmail(existingPrincipal.id, { principal: 0 });
            }
            return res.redirect(`/user/${userId}`);
            
        } catch (error) {
            console.error('Error creating email:', error);
            return res.redirect(`/user/${req.params.id}?error=Failed to add email`);
        }
    },
    showCreatePhone:(req,res)=>{
        const id=req.params.id;
        const usuarioLogado=req.session.user;
        req.session.isAuth=true;
        res.render('createPhone',{data:{usuarioLogado, id}})
    },
    createPhone: async(req,res)=>{
        try {
            const usuarioLogado=req.session.user;
            req.session.isAuth=true;
            if(usuarioLogado.perfil!=='ADMIN' && usuarioLogado.id!==parseInt(id)){
                return res.status(403).send('Permissão negada: você não pode inserir dados para este usuário');
            }
            const userId = req.params.id;
            const user = usersDAO.getById(userId);
            const phone = req.body;
            const isPrincipal = parseInt(phone.principal) === 1;
            const existingPrincipal = phonesDAO.getPhonePrincipal(user.id);
            phonesDAO.createPhone(user.id, phone.telefone, isPrincipal);
            if (isPrincipal && existingPrincipal) {
                phonesDAO.updatePhone(existingPrincipal.id, { principal: 0 });
            }
            return res.redirect(`/user/${userId}`);
            
        } catch (error) {
            console.error('Error creating phone:', error);
            return res.redirect(`/user/${req.params.id}?error=Failed to add phone`);
        }
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
    showUpdateEmail:(req,res)=>{
        const id=req.params.id;
        const id2=req.params.id2;
        const usuarioLogado=req.session.user;
        req.session.isAuth=true;
        const user=usersDAO.getById(id);
        const email=emailsDAO.getById(id2)
        if(!email){
            return res.status(404).send('E-mail não encontrado');
        }
        res.render('updateEmail', { email: email,usuarioLogado: usuarioLogado,id: id,id2: id2});
    },
    showUpdatePhone:(req,res)=>{
        const id=req.params.id;
        const id2=req.params.id2;
        const usuarioLogado=req.session.user;
        req.session.isAuth=true;
        const user=usersDAO.getById(id);
        const phone=phonesDAO.getById(id2)
        if(!phone){
            return res.status(404).send('Telefone não encontrado');
        }
        res.render('updatePhone', { phone: phone,usuarioLogado: usuarioLogado,id: id,id2: id2})
    },
    updateEmail: (req, res) => {
        const id = req.params.id;
        const id2 = req.params.id2;
        const usuarioLogado = req.session.user;
        req.session.isAuth=true;
        if (usuarioLogado.perfil !== 'ADMIN' && usuarioLogado.id !== parseInt(id)) {
            return res.status(403).send('Permissão negada');
        }
        const emailAtual = emailsDAO.getById(id2);
        if (!emailAtual) {
            return res.status(404).send('E-mail não encontrado');
        }
        const novoEmail = req.body.email || emailAtual.email;
        const isPrincipal = req.body.principal === '1' ? 1 : 0;
        const dadosAtualizacao = {
            id: id2,
            email: novoEmail,
            principal: isPrincipal,
            usuario_id: id
        };
        if (isPrincipal === 1) {
            emailsDAO.setAllNonPrincipalExcept(id, id2);
        }
        emailsDAO.updateEmail(dadosAtualizacao);

        return res.redirect(`/user/${id}`);
    },
    updatePhone:(req,res)=>{
        const id = req.params.id;
        const id2 = req.params.id2;
        const usuarioLogado = req.session.user;
        req.session.isAuth=true;
        if (usuarioLogado.perfil !== 'ADMIN' && usuarioLogado.id !== parseInt(id)) {
            return res.status(403).send('Permissão negada');
        }
        const phoneAtual = phonesDAO.getById(id2);
        if (!phoneAtual) {
            return res.status(404).send('E-mail não encontrado');
        }
        const novoPhone = req.body.phone || phoneAtual.telefone;
        const isPrincipal = req.body.principal === '1' ? 1 : 0;
        const dadosAtualizacao = {
            id: id2,
            telefone: novoPhone,
            principal: isPrincipal,
            usuario_id: id
        };
        if (isPrincipal === 1) {
            phonesDAO.setAllNonPrincipalExcept(id, id2);
        }
        phonesDAO.updateEmail(dadosAtualizacao);

        return res.redirect(`/user/${id}`);
    },
    deleteUser:(req,res)=>{
        const id=req.params;
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
    },
    deleteEmail: (req, res) => {
        const id = req.params.id;
        const id2 = req.params.id2;
        const usuarioLogado = req.session.user;
        const emailAtual = emailsDAO.getById(id2);
        if (!emailAtual) {
            return res.status(404).send('E-mail não encontrado');
        }
        if (usuarioLogado.id !== parseInt(id)) {
            return res.status(403).send('Permissão negada');
        }
        let qtdEmails = emailsDAO.countEmails(id);
        if (qtdEmails <= 1) {
            return res.status(403).send('Permissão negada: esta conta possui apenas 1 e-mail');
        }
        emailsDAO.deleteEmail(emailAtual.id);
        if (emailAtual.principal == 1) {
            const novoPrincipal = db.prepare('SELECT id FROM emails WHERE usuario_id = ? AND principal = 0 LIMIT 1').get(id);            
            if (novoPrincipal) {
                emailsDAO.setPrincipal(novoPrincipal.id);
            } else {
                console.log('Nenhum outro e-mail encontrado para definir como principal.');
            }
        }
        return res.redirect(`/user/${id}`);
    },
    deletePhone:(req,res)=>{
        const id = req.params.id;
        const id2 = req.params.id2;
        const usuarioLogado = req.session.user;
        const phoneAtual = phonesDAO.getById(id2);
        if (!phoneAtual) {
            return res.status(404).send('Telefone não encontrado');
        }
        if (usuarioLogado.id !== parseInt(id)) {
            return res.status(403).send('Permissão negada');
        }
        let qtdPhones = phonesDAO.countPhones(id);
        if (qtdPhones <= 1) {
            return res.status(403).send('Permissão negada: esta conta possui apenas 1 telefone');
        }
        phonesDAO.deletePhone(phoneAtual.id);
        if (phoneAtual.principal == 1) {
            const novoPrincipal = db.prepare('SELECT id FROM telefones WHERE usuario_id = ? AND principal = 0 LIMIT 1').get(id);            
            if (novoPrincipal) {
                phonesDAO.setPrincipal(novoPrincipal.id);
            } else {
                console.log('Nenhum outro e-mail encontrado para definir como principal.');
            }
        }
        return res.redirect(`/user/${id}`);
    }
}

module.exports=usersController