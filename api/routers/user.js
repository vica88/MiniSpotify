'use strict'

var express = require('express');
//cargamos el user controller
var UserController = require('../controllers/user');
//cargamos el router de express
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

//multiparty es un modulo que nos permite subir ficheros y enviarlos por el protocolo HTTP
var multipart = require('connect-multiparty');
//creamos un middleware | ficheros donde se va a escuchar | directorio donde se van a subir todas las imagenes
var md_upload = multipart({ uploadDir: './uploads/users'});

//creamos una ruta, para utilizar el middleware se pasa como 2do parametro 
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
//api.put actualizar datos o recursos de la BD | :id es para recibir el id por la URL
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;