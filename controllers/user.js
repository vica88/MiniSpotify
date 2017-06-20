'use strict'

//guardamos la contraseña ya encriptada
var bcrypt = require('bcrypt-nodejs');
//importamos el modelo/cargamos el modulo
var User = require('../models/user');
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

module.exports = {
	pruebas,
	saveUser
};