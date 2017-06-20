'use strict'

//cargar en una variable la libreria de express
var express = require('express');
//cargamos bodyParser
var bodyParser = require('body-parser');
//crear el objeto de express dentro de una var app
var app = express();

//cargar rutas
var user_routes = require('./routers/user');


//necesario para que funcione bodyparser
app.use(bodyParser.urlencoded({extended:false}));
//convertir a objeto JSON los datos que nos llegan por las peticiones 
//HTTP y poder trabajar con ellos dentro del proyecto
app.use(bodyParser.json());

//configurar cabeceras HTTP

//rutas base
app.use('/api',user_routes);

module.exports = app;