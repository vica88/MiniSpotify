'use strict'

var mongoose = require('mongoose');
//creamos un objeto de tipo esquema, se guardan en una
//coleccion concreta y se guarda un documento concreto
//dentro de esa coleccion
var Schema = mongoose.Schema;

//creamos un esquema para nuestro modelo de artista
var ArtistSchema = Schema({
		name: String,
		description: String,
		image: String
});

//para utilizar el objeto fuera de este fichero
//exportamos el modelo
//objeto Artist que vamos a poder instanciar y asignarle valores al esquema
//de la BD, se va a guardar dentro de una coleccion "artist" y guarda
//una instancia de c/u de los artistas que vayamos guardando
module.exports = mongoose.model('Artist',ArtistSchema);
