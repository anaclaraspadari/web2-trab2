const isAuth = (req, res, next) => {
    console.log('Session:'+JSON.stringify(req.session));
    if(req.session.isAuth){
        console.log("Usuario autenticado")
        return next();
    }else{
        return res.status(401).send('Usuário não autenticado');
    }
}

module.exports = isAuth;