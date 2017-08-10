'use strict'

//cargamos express para poder acceder a las rutas y crear nuevas rutas
var express = require('express');

var AlbumController = require('../controllers/album');
//nos permite hacer todas las funciones post,get put
var api = express.Router();
//cargamos el middleware de autenticacion, q nos permite restringir el acceso a usuarios correctamente
//logueados a los metodos de este controlador
var md_auth = require('../middlewares/authenticated');

//multiparty es un modulo que nos permite subir ficheros y enviarlos por el protocolo HTTP
var multipart = require('connect-multiparty');
//creamos un middleware | ficheros donde se va a escuchar | directorio donde se van a subir todas las imagenes
var md_upload = multipart({ uploadDir: './uploads/albums'});


api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

//exportamos los metodos del api
module.exports = api;