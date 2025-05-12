const { Router } = require('express');
const usersController = require('../controllers/users-controller');
const isAuth = require('../middlewares/isAuth');

const usersRouter = Router();

usersRouter.get('/users', usersController.getAll);
usersRouter.get('/createUser',usersController.showCreateUser);
usersRouter.post('/createUser', usersController.createUser);
usersRouter.get('/updateUser/:id',isAuth, usersController.showUpdateUser)
usersRouter.post('/updateUser/:id', isAuth, usersController.updateUser);
usersRouter.post('/deleteUser/:id', isAuth, usersController.deleteUser);
usersRouter.get('/user/:id', usersController.getById);
usersRouter.get('/login',  usersController.showLoginPage);
usersRouter.post('/login',  usersController.login);
usersRouter.get('/logout',  usersController.logout);
usersRouter.get('/createEmail', usersController.showCreateEmail)
usersRouter.get('/createPhone', usersController.showCreatePhone)

module.exports = usersRouter;