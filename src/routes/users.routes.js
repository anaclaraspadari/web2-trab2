const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const isAuth = require('../middlewares/isAuth');
const authController = require('../controllers/auth.controller');
const isAdmin = require('../middlewares/isAdmin');

const usersRouter = Router();

usersRouter.get('/users', isAuth, usersController.getAll);
usersRouter.post('/addUser', isAuth, usersController.create);
usersRouter.post('/updateUser/:id', isAuth, usersController.update);
usersRouter.post('/deleteUser/:id', isAuth, isAdmin, usersController.delete);
usersRouter.post('/user/:id', isAuth, usersController.getById);
usersRouter.post('/login',  authController.login);
usersRouter.get('/logout',  authController.logout);

module.exports = usersRouter;