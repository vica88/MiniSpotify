'use strict'

//importamos jwt
var jwt = require('jwt-simple');
//cargamos la libreria momentJS para que en el payload que es el objeto que codifique el jwt y lo guarda en un token
//donde esta la fecha de creacion del token y la fecha de expiracion, para comprobar luego si las fechas son 
//incorrectas, debe volver a loguearse el usuario
var moment = require('moment');
//la clave secreta que se utilizara para codificar el objeto
var secret = 'clave_secreta_curso';

//se le pasa el objeto de usuario que es el que codifica dentro del token (hash), donde con la peticion http se transporta la
//informacion del usuario que esta logueado y asi comprobamos si el usuario esta logueado o no
exports.createToken = function(user){
	//datos que se van a codificar
	var payload = {
		//se usa para guardar el id del regristro o el id del documento de la BD
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		//fecha de creacion del token
		iat: moment().unix(),
		//aca guardamos la fecha de expiracion
		exp: moment().add(30, 'days').unix,

	};
	// devolvemos el token codificado (codificamos el payload, datos que estan en el token guardado y le pasamos una clave secreta, 
	//para que el genere el hash en base a esa clave secreta)
	return jwt.encode(payload, secret);
};