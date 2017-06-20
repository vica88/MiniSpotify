'use strict'

var mongoose = require('mongoose');
//creamos un objeto de tipo esquema, se guardan en una
//coleccion concreta y se guarda un documento concreto
//dentro de esa coleccion
var Schema = mongoose.Schema;

//creamos un esquema para nuestro modelo de song
var SongSchema = Schema({
		number: String;
		name: String;
		duration: String;
		file: String;
		album: {type: Schema.ObjectId, ref: 'Album'}
});

//para utilizar el objeto fuera de este fichero
//exportamos el modelo
//objeto Song que vamos a poder instanciar y asignarle valores al esquema
//de la BD, se va a guardar dentro de una coleccion "song" y guarda
//una instancia de c/u de los songs que vayamos guardando
module.exports = mongoose.model('Song',SongSchema);