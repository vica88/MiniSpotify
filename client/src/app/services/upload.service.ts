//IMPORTS BASICOS QUE TENDRIA UN SERVICIO CASI SIEMPRE
//usamos el componente "Injectable" que viene de Angular 2
import { Injectable } from '@angular/core';
//usamos el modulo HTTP response
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//utilizamos una libreria para mapear objetos
import 'rxjs/add/operator/map';
//vamos a utilizar los "observable" para recoger las respuestas de cuando hacemos una peticion ajax al servidor
import { Observable } from 'rxjs/Observable';
//el .ts o .js se omite porque ya lo reconoce el framework o lenguaje
import { GLOBAL } from './global';
//importamos el modelo de artista
import { Artist } from '../models/artist';

//definimos el decorador "@injectable" a la clase para permitir que luego mediante la inyeccion de dependencias podamos inyectar 
//este servicio (clase) en otros componentes o en otras clases y poder utilizarla de manera muy sencilla
@Injectable()
export class UploadService{
	public url: string;
	//tenemos que asignarle un valor a la propiedad url al cargar este servicio
	//para poder utilizar el servicio http tenemos que inyectar la dependencia "Http" que tenemos en el 2do import
	//http: Http -> podemos usar el objeto http y todas las librerias de sus metodos
	constructor(private _http: Http){
		//asigna un valor a la propiedad url, donde su valor sera el que tenga la variable GLOBAL
		//de esta forma tenemos la url disponible en toda la clase para usarla
		this.url = GLOBAL.url;
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){
		//lanza el codigo de la subida
		return new Promise(function(resolve, reject){
			//simulamos el comportamiento de un formulario normal
			var formData: any = new FormData();
			//peticion ajax de JS tipica
			var xhr = new XMLHttpRequest();
			//recorremos los ficheros que recibimos por el array
			for(var i = 0; i < files.length; i++){
				//añadimos con el name image| le pasamos el file que este en el momento | y el nombre
				formData.append(name, files[i], files[i].name);
			}
			//comprobamos si esta lista la peticion para realizarse
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}
			//lanzamos la peticion de tipo post a la url y que la haga
			xhr.open('POST', url, true);
			//le indicamos un header de autorizacion y le pasamos el token del usuario logueado
			xhr.setRequestHeader('Authorization', token);
			//y lanzamos la peticion con todos los datos
			xhr.send(formData);
		});
	}
}