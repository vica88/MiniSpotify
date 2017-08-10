//es un metodo que se va a ejecutar antes que se realice la accion del controlador, es decir una peticion http
//se va a ejecutar antes que nada el middleware y dsp ya el contenido que tenga la ruta asociado, etc

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

//request, response y un next para salir del middleware
exports.ensureAuth = function(req, res, next){
	//en caso que no llegue el header
	if(!req.headers.authorization){
		return res.status(403).send({message: 'La peticion no tiene la cabecera de la autorizacion'});

	}
	//como tenemos la cabecera con la autorizacion, llega como un token, como puede llegar con comillas, las eliminamos
	var token = req.headers.authorization.replace(/['"]+/g,'');

	try{
		//pasamos el token que viene por la cabecera de autorizacion
		var payload = jwt.decode(token, secret);
		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'Token ha expirado'});

		}
	}catch(ex){
		/*console.log(ex);*/
		return res.status(404).send({message: 'Token no valido'});
	}
	//añanidmos una propiedad al objeto request, ahora tenemos disponible dentro de cada metodo que utilice 
	//este middleware tenemos un objeto user con todos los datos del usuario identificado que nos viene dentro del token
	//con lo cual no vamos a tener que decodificarlo dentro de ese metodo, ni nada por el estilo, ni vamos a tener que
	//volver a sacar la autorizacion, ya vamos a tener un objeto user en la request (la peticion)
	req.user = payload;

	//llamamos a la funcion next para salir de este middleware
	next();
};