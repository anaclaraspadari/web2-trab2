function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.perfil !== 'ADMIN') {
        return res.status(403).send('Acesso negado');
    }
    next();
}

module.exports = { requireLogin, requireAdmin };
