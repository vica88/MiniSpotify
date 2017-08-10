//IMPORTS BASICOS QUE TENDRIA UN SERVICIO CASI SIEMPRE
//usamos el componente "Injectable" que viene de Angular 2
import { Injectable } from '@angular/core';
//usamos el modulo HTTP response
import { Http, Response, Headers } from '@angular/http';
//utilizamos una libreria para mapear objetos
import 'rxjs/add/operator/map';
//vamos a utilizar los "observable" para recoger las respuestas de cuando hacemos una peticion ajax al servidor
import { Observable } from 'rxjs/Observable';
//el .ts o .js se omite porque ya lo reconoce el framework o lenguaje
import { GLOBAL } from './global'

//definimos el decorador "@injectable" a la clase para permitir que luego mediante la inyeccion de dependencias podamos inyectar 
//este servicio (clase) en otros componentes o en otras clases y poder utilizarla de manera muy sencilla
@Injectable()
export class UserService{
	public identity;
	public token;
	public url: string;
	//tenemos que asignarle un valor a la propiedad url al cargar este servicio
	//para poder utilizar el servicio http tenemos que inyectar la dependencia "Http" que tenemos en el 2do import
	//http: Http -> podemos usar el objeto http y todas las librerias de sus metodos
	constructor(private _http: Http){
		//asigna un valor a la propiedad url, donde su valor sera el que tenga la variable GLOBAL
		//de esta forma tenemos la url disponible en toda la clase para usarla
		this.url = GLOBAL.url;
	}

	//recibe dos parametros: el usuaria que vamos a loguear (objeto que tenemos en nuestro componente)
	//y un parametro alternativo getHash, inicializado a null porque no va a ser obligatorio, si turviera algo
	//vamos a necesitar que el api rest nos saque el hash, no el objeto del usuario logueado. 
	//Por un lado, si no le pasamos el getHash nos va a devolver un objeto completo con todos los datos completos del 
	//usuario que se ha logueado y si le pasamos el getHash tmb nos va a devolver el token de jwt que hemos generado en el backend
	//para poder reutilizarlo luego
	singUp(user_to_login, gethash = null){
		if(gethash != null){
			user_to_login.gethash = gethash;
		}
		//para hacer una peticion al servicio rest, creamos una variable json y convertimos a string el objeto que recibimos
		let json = JSON.stringify(user_to_login);
		let params = json;
		//dentro de Headers definimos los json con los headers que le vamos a pasar, como trabajamos en JS, le pasamos json
		let headers = new Headers({ 'Content-Type': 'application/json' });
		//devolvemos la peticion ajax| le concatenamos nuestro metodo "login" de la api a la url
		//le pasamos los parametros, q son los datos que vamos a pasarle por post, en el body de la request y los headers
		//capturamos la respuesta y la mapeamos con su funcion de callback que recibimos la respuesta y luego la codificamos en un objeto json usable
		return this._http.post(this.url+'login', params, {headers: headers}).map(res => res.json());
	}

	register(userToRegister){
		//a diferencia de singUp guardamos todo en params, pero si necesitaramos hacer mas cosas con json, deberiamos hacer como en el metodo
		//singUp
		let params = JSON.stringify(userToRegister);
		//dentro de Headers definimos los json con los headers que le vamos a pasar, como trabajamos en JS, le pasamos json
		let headers = new Headers({ 'Content-Type': 'application/json' });
		//devolvemos la peticion ajax| le concatenamos nuestro metodo "register" de la api a la url
		//le pasamos los parametros, q son los datos del usuario que tiene que guardar, le pasamos las cabeceras, idem map
		return this._http.post(this.url+'register', params, {headers: headers}).map(res => res.json());
	}

	updateUser(userToUpdate){
		let params = JSON.stringify(userToUpdate);
		//dentro de Headers definimos los json con los headers que le vamos a pasar, como trabajamos en JS, le pasamos json
		let headers = new Headers({ 
				'Content-Type': 'application/json',
				//le pasamos la autorizacion, es decir, el token para comprobar si esta bien logueado el usuario a nivel de BD/Api
				'Authorization': this.getToken() 
			});
		//devolvemos la peticion ajax| le concatenamos nuestro metodo "register" de la api a la url
		//le pasamos los parametros, q son los datos del usuario que tiene que guardar, le pasamos las cabeceras, idem map
		return this._http.put(this.url+'update-user/'+userToUpdate._id, params, {headers: headers}).map(res => res.json());
	}

	//metodos que sirven para acceder al LocalStorage, conseguir el elemento que queramos y devolverlo procesado con la informacion que queremos
	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}


}



