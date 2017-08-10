'use strict'

//cargar en una variable la libreria de express
var express = require('express');
//cargamos bodyParser
var bodyParser = require('body-parser');
//crear el objeto de express dentro de una var app
var app = express();

//cargar rutas
var user_routes = require('./routers/user');
var artist_routes = require('./routers/artist');
var album_routes = require('./routers/album');
var song_routes = require('./routers/song');


//necesario para que funcione bodyparser
app.use(bodyParser.urlencoded({extended:false}));
//convertir a objeto JSON los datos que nos llegan por las peticiones 
//HTTP y poder trabajar con ellos dentro del proyecto
app.use(bodyParser.json());

//configurar cabeceras HTTP
//añadimos un middleware para configurar las cabeceras en cada peticion
app.use((req, res, next) => {
	//con esto permitimos acceso a todos los dominios a nuestra API
	res.header('Access-Control-Allow-Origin', '*');
	//son cabeceras necesarias para que la API a nivel de Ajax funcione
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	//permitimos los metodos HTPP mas comunes
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});



//rutas base
app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);

module.exports = app;