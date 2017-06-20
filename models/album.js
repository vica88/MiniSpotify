'use strict'

var mongoose = require('mongoose');
//creamos un objeto de tipo esquema, se guardan en una
//coleccion concreta y se guarda un documento concreto
//dentro de esa coleccion
var Schema = mongoose.Schema;

//creamos un esquema para nuestro modelo de album
var AlbumSchema = Schema({
		tittle: String;
		description: String;
		year: Number;
		imagen: String;
		artist: {type: Schema.ObjectId, ref: 'Artist'}
});

//para utilizar el objeto fuera de este fichero
//exportamos el modelo
//objeto Album que vamos a poder instanciar y asignarle valores al esquema
//de la BD, se va a guardar dentro de una coleccion "album" y guarda
//una instancia de c/u de los albunes que vayamos guardando
module.exports = mongoose.model('Album',AlbumSchema);