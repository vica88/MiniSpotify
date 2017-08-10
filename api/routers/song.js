'use strict'

//cargamos express para poder acceder a las rutas y crear nuevas rutas
var express = require('express');

var SongController = require('../controllers/song');
//nos permite hacer todas las funciones post,get put
var api = express.Router();
//cargamos el middleware de autenticacion, q nos permite restringir el acceso a usuarios correctamente
//logueados a los metodos de este controlador
var md_auth = require('../middlewares/authenticated');

//multiparty es un modulo que nos permite subir ficheros y enviarlos por el protocolo HTTP
var multipart = require('connect-multiparty');
//creamos un middleware | ficheros donde se va a escuchar | directorio donde se van a subir todas las imagenes
var md_upload = multipart({ uploadDir: './uploads/songs'});


api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song/', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

//exportamos los metodos del api
module.exports = api;