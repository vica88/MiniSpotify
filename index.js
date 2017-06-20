//poder meter isntrucciones de los nuevos estandares de JS, etc
'use strict'

//cargar el modulo o libreria de MongoDB
var mongoose = require('mongoose');
// tiene toda la configuracion de express
//y de las rutas, fichero de carga central
var app = require('./app')
//configurar un puerto para nuestro API (servidor)
var port = process.env.PORT || 3977;

//Para eliminar el aviso de mongoose que devuelve por la consola donde hemos lanzado el npm start
mongoose.Promise = global.Promise;

//conexion a MongoDB
mongoose.connect('mongodb://localhost:27017/curso_mean2',(err,res)=>{
	if(err){
		throw err;
	}else{
		console.log("La base de datos esta funcionando correctamente...");

		//ponemos el servidor a escuchar
		app.listen(port,function(){
			console.log("Servidor del API Rest de musica escuchando en http://localhost:"+port);
		});
	}
}) 