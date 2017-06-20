'use strict'

var express = require('express');
//cargamos el user controller
var UserController = require('../controllers/user');
//cargamos el router de express
var api = express.Router();
//creamos una ruta 
api.get('/probando-controlador',UserController.pruebas);
api.post('/register',UserController.saveUser);

module.exports = api;