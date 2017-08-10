'use strict'

//para poder trabajar con los ficheros
var fs = require('fs');
var path = require('path');
//importamos el modulo para paginacion
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
	//recogemos el id que nos llega por el URL
	var artistId = req.params.id;
	Artist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}

		}
	});
}

function getArtists(req,res){
	if(req.params.page) {
		var page = req.params.page;
	}else{
		page = 1;
	}

	var page = req.params.page;
	//esta variable sirve para indicar la cantidad de artista q aparecen por pagina
	var itemsPerPage = 4;
	//con el find obtenemos todo lo que hay en esa coleccion de objetos
	//los ordenamos por nombre 
	//y con el metodo paginate, paginamos, le pasamos el nro de pagina, la cantidad de eltos
	//que sacara de la base de datos y una funcion de callback(error, los artistas y el total de items q se sacaron)
	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, totalItems){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas!!'});
			}else{
				return res.status(200).send({
					//devolvemos un objeto con el total de paginas y el array de objetos artist
					totalItems: totalItems,
					artists: artists
				});	
			}
		}
	});
}


function saveArtist(req,res){
	var artist = new Artist();
	//recogemos los parametros que nos llegan al body por la request y se la asignamos a las
	//propiedades del artista
	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = "null";

	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el Artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				//pasamos un objeto donde se guardara el artista
				res.status(200).send({artist: artistStored});
			}

		}
	});
}

function updateArtist(req,res){
	var artistId = req.params.id;
	//nos llegan los datos por post, los datos que actualizamos, guardamos el body de la peticion
	var update = req.body;
	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el Artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});

}

function deleteArtist(req,res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				//borramos todo lo que tenga asociado el artista
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
									res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});	
}

function uploadImage(req,res){
	var artistId = req.params.id;
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
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err,artistUpdated) => {
				if(!artistUpdated){
					res.status(404).send({message:'No se ha podido actualizar el artista'});

				}else{
					res.status(200).send({artist: artistUpdated});
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
	var path_file = './uploads/artists/'+imageFile;
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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}