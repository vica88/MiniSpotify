'use strict'

//para poder trabajar con los ficheros
var fs = require('fs');
var path = require('path');
//importamos el modulo para paginacion
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!song){
				res.status(404).send({message: 'No existe la cancion!!'});
			}else{
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req,res){
	//guardamos el album ID que nos llega por la URL, en el caso de q nos llegue
	//sacamos solamente las canciones asociadas a un album y en el caso de q no 
	//nos llegue nada, mostramos todas las canciones de la BD
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		//album tiene que ser igual a albumId
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, songs) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones!!'})
			}else{
				res.status(200).send({songs});
			}
		}
	});
}



function saveSong(req,res){
	var song = new Song();
	
	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'No se ha guardado la cancion'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});
}

function updateSong(req,res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha actualizado la cancion'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	});
}

function deleteSong(req,res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No se ha borrado la cancion'});
			}else{
				res.status(200).send({song: songRemoved});
			}
		}
	});
}

function uploadFile(req,res){
	var songId = req.params.id;
	//variable para el fichero | en el caso de que no venga nada "imagen no subida"
	var file_name = 'imagen no subida';
	//con el multiparty podemos usar las variables globales "files"
	//si viene algo por files
	if(req.files){
		var file_path = req.files.file.path;
		//recortamos el string y conseguir unicamente el nombre de la imagen en si
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		//sacar extension de la imagen
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		//verificamos que tenga la extension correcta
		if(file_ext =='mp3' || file_ext == 'ogg') {
			Song.findByIdAndUpdate(songId, {file: file_name}, (err,songUpdated) => {
				if(!songUpdated){
					res.status(404).send({message:'No se ha podido actualizar la cancion'});

				}else{
					res.status(200).send({song: songUpdated});
				}

			});
		}else{
			res.status(200).send({message: 'Extension del archivo no valida'});
		}
		console.log(ext_split);
	}else{
		res.status(404).send({message: 'No has subido el fichero de audio...'});
		}
}

//metodo que va a sacar un fichero del servidor y nos lo devuelve para poder mostrarlo, etc
function getSongFile(req,res){
	//recogemos el parametro que nos va a llegar por la URL
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;
	//comprobamos si existe un fichero en el servidor (dentro de la carpeta upload del usuario)
	fs.exists(path_file, function(exits){
		//si existe, comprobamos que el parametro que recibimos en la funcion de callback es correcto
		if(exits){
			//respuesta HTTP, nos envia un fichero
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe el fichero de audio...'});
		}
	});
}


module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}