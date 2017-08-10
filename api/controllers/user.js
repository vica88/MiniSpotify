'use strict'

//importamos los modulos fs y path para poder trabajar con el sistema de ficheros del sistema
var fs = require('fs');
var path = require('path');

//guardamos la contraseña ya encriptada
var bcrypt = require('bcrypt-nodejs');
//importamos el modelo/cargamos el modulo
var User = require('../models/user');

var jwt = require('../services/jwt');
//recibe una request(es lo que va a recibir en la peticion)
//y una response(lo que va a devolver)
function pruebas(req,res){
	res.status('200').send({
		message:'Probando una accion del controlador de usuarios del api rest con node y mongo'
	});
}

//funcion para guardar el registro de usuario
function saveUser(req,res){
	var user = new User();
	//guardamos los parametros que nos llegan
	//por peticion por post en el body
	var params = req.body;

	console.log(params);
	//asignamos los valores de las propiedades del usuario
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	//guardamos los datos en BD con metodo "save"
	//de mongoose 
	if(params.password){
	// encriptamos la contraseña q nos viene
	bcrypt.hash(params.password,null,null,function(err,hash){
		user.password = hash;
		if(user.name != null && user.surname != null && user.email != null){
			//guardamos el usuario con el metodo save de mongoose
			user.save((err,userStored) => {
			if(err) {
				res.status(500).send({message: 'Error al guardar el usuario'});
			}else{
				if(!userStored) {
					res.status(404).send({message: 'No se ha registrado el usuario'});

				}else{
					//nos devuelve objeto con todos los datos del usuario guardado en la BD
					res.status(200).send({user: userStored});

				}
			}

			});

		}else{
			//mejor error 200, que todo ha ido correctamente
			//error 400 es para indicar que un recurso no existe
			//error 500 seria para una excepcion o no se guarda bien un dato (error de servidor, conexion a BD)
			//
			res.status(200).send({message: 'Rellena todos los campos'});
		}
	});	
	}else{
		res.status(200).send({message: 'Introduce la contraseña'})
	}
}

//comprueba que lo que nos llega por POST (email y contraseña) existen y coinciden con la BD
function loginUser(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err,user) =>{
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message:'El usuario no existe'});
			}else{
				//comprobar la contraseña
				bcrypt.compare(password, user.password, function(err,check){
				if(check){
					//devolver los datos del usuario logueado
					if(params.gethash){
						//devolver un token de jwt
						res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
						res.status(200).send({user});
					}
				}else{
					res.status(404).send({message:'El usuario no ha podido loguearse'});
					}
				})
			}
		}
	})
}

function updateUser(req,res){
	//recogemos el id del usuario que nos llega como parametro de la URL (variable)
	var userId = req.params.id;
	//conseguimos el body del post, datos del usuario que queremos actualizar
	var update = req.body;

	if(userId != req.user.sub){
		//el return se pone para que no siga mas abajo, sino que devuelva el error y termine
		return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
	}
	//actualiza un usuario segun el id y lo actualiza segun los datos a actualizar
	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message:'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message:'No se ha podido actualizar el usuario'});

			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

//metodo para subir ficheros
function uploadImage(req,res){
	var userId = req.params.id;
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
			User.findByIdAndUpdate(userId, {image: file_name}, (err,userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message:'No se ha podido actualizar el usuario'});

				}else{
					res.status(200).send({image: file_name, user: userUpdated});
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
	var path_file = './uploads/users/'+imageFile;
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
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};