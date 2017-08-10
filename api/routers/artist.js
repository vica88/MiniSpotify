'use strict'

//cargamos express para poder acceder a las rutas y crear nuevas rutas
var express = require('express');

var ArtistController = require('../controllers/artist');
//nos permite hacer todas las funciones post,get put
var api = express.Router();
//cargamos el middleware de autenticacion, q nos permite restringir el acceso a usuarios correctamente
//logueados a los metodos de este controlador
var md_auth = require('../middlewares/authenticated');

//multiparty es un modulo que nos permite subir ficheros y enviarlos por el protocolo HTTP
var multipart = require('connect-multiparty');
//creamos un middleware | ficheros donde se va a escuchar | directorio donde se van a subir todas las imagenes
var md_upload = multipart({ uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
//? es para decir que puede ser opcional, puede que venga o no
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

//exportamos los metodos del api
module.exports = api;