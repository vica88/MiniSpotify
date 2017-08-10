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
export class ArtistService{
	public url: string;
	//tenemos que asignarle un valor a la propiedad url al cargar este servicio
	//para poder utilizar el servicio http tenemos que inyectar la dependencia "Http" que tenemos en el 2do import
	//http: Http -> podemos usar el objeto http y todas las librerias de sus metodos
	constructor(private _http: Http){
		//asigna un valor a la propiedad url, donde su valor sera el que tenga la variable GLOBAL
		//de esta forma tenemos la url disponible en toda la clase para usarla
		this.url = GLOBAL.url;
	}

	//recibe una pagina, q sera la pagina que cargara a nivel de paginacion
	getArtists(token, page){
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});
		//para pasarle estas cabeceras le vamos a poner unas opciones a la request
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'artists/'+page, options).map(res => res.json());
	}

	getArtist(token, id: string){
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});
		//para pasarle estas cabeceras le vamos a poner unas opciones a la request
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'artist/'+id, options).map(res => res.json());
	}

	//pasamos el token del usuario identificado y un objeto de tipo artista
	addArtist(token, artist: Artist){
		let params = JSON.stringify(artist);
		//le mandamos informacion a la query(peticion) para comprobar el token del usuario
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});
		//hacemos la llamada a http
		return this._http.post(this.url+'artist', params, {headers: headers}).map(res => res.json());
	}

	editArtist(token, id: string, artist: Artist){
		let params = JSON.stringify(artist);
		//le mandamos informacion a la query(peticion) para comprobar el token del usuario
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});
		//hacemos la llamada a http
		return this._http.put(this.url+'artist/'+id, params, {headers: headers}).map(res => res.json());
	}

	deleteArtist(token, id: string){
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});
		//para pasarle estas cabeceras le vamos a poner unas opciones a la request
		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'artist/'+id, options).map(res => res.json());
	}
}