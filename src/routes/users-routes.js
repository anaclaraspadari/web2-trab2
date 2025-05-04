const { Router } = require('express');
const usersController = require('../controllers/users-controller');
const isAuth = require('../middlewares/isAuth');
// const authController = require('../controllers/auth.controller');

const usersRouter = Router();

usersRouter.get('/users', usersController.getAll);
// usersRouter.post('/addUser', isAuth, usersController.create);
// usersRouter.post('/updateUser/:id', isAuth, usersController.update);
// usersRouter.post('/deleteUser/:id', isAuth, usersController.delete);
usersRouter.get('/user/:id', usersController.getById);
// usersRouter.post('/login',  authController.login);
// usersRouter.get('/logout',  authController.logout);

module.exports = usersRouter;