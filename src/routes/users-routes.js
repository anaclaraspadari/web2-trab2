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
usersRouter.get('/user/:id/createEmail', isAuth, usersController.showCreateEmail)
usersRouter.get('/user/:id/createPhone', isAuth, usersController.showCreatePhone)
usersRouter.post('/user/:id/createEmail', isAuth, usersController.createEmail)
usersRouter.post('/user/:id/createPhone', isAuth, usersController.createPhone)
usersRouter.get('/user/:id/updateEmail/:id2', isAuth, usersController.showUpdateEmail)
usersRouter.get('/user/:id/updatePhone/:id2', isAuth, usersController.showUpdatePhone)
usersRouter.post('/user/:id/updateEmail/:id2', isAuth, usersController.updateEmail)
usersRouter.post('/user/:id/updatePhone/:id2', isAuth, usersController.updatePhone)
usersRouter.post('/user/:id/deleteEmail/:id2', isAuth, usersController.deleteEmail)

module.exports = usersRouter;