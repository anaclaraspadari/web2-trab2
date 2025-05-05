const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        console.log("Usuario autenticado")
        return next();
    }else{
        console.log("Usuario não autenticado")
    }
}

module.exports = isAuth;