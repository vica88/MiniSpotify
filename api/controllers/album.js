'use strict'

//para poder trabajar con los ficheros
var fs = require('fs');
var path = require('path');
//importamos el modulo para paginacion
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req,res){

	var albumId = req.params.id;

	//utilizamos el metodo "populate" para decirle que popule los datos del objeto artista
	//asociados a la propiedad "artist", le indicamos el path, q es la propiedad donde se van a cargar
	//los datos del objeto asociados a esta propiedad. Dentro de artist como tenemos un ID de otro objeto
	//guardado dentro de artista, nos va a cargar utilizando populate todos los datos de un objeto completo 
	//de tipo artista asociado al ID  que tenemos guardado por defecto en el registro de la BD
	//de esta forma lo que hacemos es conseguir todos los datos del artista que ha creado un album
	//sacar todo el registro, cuyo ID es el que ya tenemos por default guardado en la propiedad artist
	//del registro que tengamos guardado en la BD || utilizamos el metodo exec para poder lanzar el find 
	//y sacar los datos de la BD
	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!album){
				res.status(404).send({message: 'El Album no existe'});
			}else{
				res.status(200).send({album});
			}	
		}
	});


	/*res.status(200).send({message: 'Accion getAlbum'});*/
}

function getAlbums(req,res){
	//recogemos el artist ID porq qremos listar todos los albums que hay dentro de un artista
	var artistId = req.params.artist;
	if(!artistId){
		//sacar todos los albums de la BD
		var find = Album.find({}).sort('title');
	}else{
		//sacar todos los albums de un artista en concreto de la BD
		var find = Album.find({artist: artistId}).sort('year');

		find.populate({path: 'artist'}).exec((err, albums) => {
			if(err){
				res.status(500).send({message: 'Error en la peticion'});
			}else{
				if(!albums){
					res.status(404).send({message: 'No hay albums'});
				}else{
					res.status(200).send({albums});
				}

			}
		});
	}
}

function updateAlbum(req,res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'No se ha actualizado el album'});
			}else{
				res.status(200).send({album: albumUpdated});
			}	
		}

	});
}


function saveAlbum(req,res){
	var album = new Album();
	
	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message: 'Error en la servidor'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'No se ha guardado el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function deleteAlbum(req,res){
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
					if(err){
						res.status(500).send({message: 'Error al eliminar el album'});
					}else{
						if(!albumRemoved){
							res.status(404).send({message: 'El album no ha sido eliminado'});
						}else{
							Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
								if(err){
									res.status(500).send({message: 'Error al eliminar la cancion'});
								}else{
									if(!songRemoved){
										res.status(404).send({message: 'La cancion no ha sido eliminada'});
								}else{
									res.status(200).send({album: albumRemoved});
									}
								}
							});
						}
					}
				});
}

function uploadImage(req,res){
	var albumId = req.params.id;
	//variable para el fichero | en el caso de que no venga nada "imagen no subida"
	var file_name = 'imagen no subida';
	//con el multiparty podemos usar las variables globales "files"
	//si viene algo por files
	if(req.files){
		var file_path = req.files.image.path;
		//recortamos el string y conseguir unicamente el nombre de la imagen en si
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		//sacar extension de la imagen
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		//verificamos que tenga la extension correcta
		if(file_ext =='png' || file_ext == 'jpg' || file_ext == 'gif') {
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err,albumUpdated) => {
				if(!albumUpdated){
					res.status(404).send({message:'No se ha podido actualizar el usuario'});

				}else{
					res.status(200).send({album: albumUpdated});
				}

			});
		}else{
			res.status(200).send({message: 'Extension del archivo no valida'});
		}
		console.log(ext_split);
	}else{
		res.status(404).send({message: 'No has subido ninguna imagen...'});
		}
}

//metodo que va a sacar un fichero del servidor y nos lo devuelve para poder mostrarlo, etc
function getImageFile(req,res){
	//recogemos el parametro que nos va a llegar por la URL
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile;
	//comprobamos si existe un fichero en el servidor (dentro de la carpeta upload del usuario)
	fs.exists(path_file, function(exits){
		//si existe, comprobamos que el parametro que recibimos en la funcion de callback es correcto
		if(exits){
			//respuesta HTTP, nos envia un fichero
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});

}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}