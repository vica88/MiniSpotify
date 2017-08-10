import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
	public album: Album;
	public songs: Song[];
	public identity;
	public token;
	public url: string;
	public alertMessage;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService

	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('album-detail.component.ts cargado');

		//Sacar album de la bd
		this.getAlbum()
	}

	getAlbum(){
		//recogemos el id que nos llega por parametro de la url | con el metodo "forEach"
		//que genera un array con todos los parametros que hay por la url
		this._route.params.forEach((params: Params) =>{
			//accedemos al indice "id", y de este modo recogemos el id que nos llega por la url
			let id = params['id'];
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					if(!response.album){
						this._router.navigate(['/']);
					}else{
						this.album = response.album;

						//Sacar las canciones del album
						this._songService.getSongs(this.token, response.album._id).subscribe(
							response => {
								if(!response.songs){
									this.alertMessage = 'Este album no tiene canciones';						
								}else{
									this.songs = response.songs;
								}
							},		
							error => {
								var errorMessage = <any>error;
								if(errorMessage != null){
			          				//parseamos a json a objeto real el body
			          				var body = JSON.parse(error._body);
			          				//this.alertMessage = body.message;
			          				console.log(error);	
								}
							}	
						);
					}
				},
				error => {
					var errorMessage = <any>error;
					if(errorMessage != null){
          				//parseamos a json a objeto real el body
          				var body = JSON.parse(error._body);
          				//this.alertMessage = body.message;
          				console.log(error);	
					}
				}	
			);
		});
	}

	public confirmado;
	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelSong(){
		this.confirmado = null;
	}

	onDeleteSong(id){
		this._songService.deleteSong(this.token, id).subscribe(
			response => {
				if(!response.song){
					this.alertMessage = 'Error en el servidor';						
				}
				//En caso de que llegue bien, se llama al metodo getAlbum, para que vuelva a refrescar el album
				//y el listado de canciones
				this.getAlbum();
			},		
			error => {
				var errorMessage = <any>error;
				if(errorMessage != null){
      				//parseamos a json a objeto real el body
      				var body = JSON.parse(error._body);
      				//this.alertMessage = body.message;
      				console.log(error);	
				}
			}	
		);	
	}

	startPlayer(song){
		let	songPlayer = JSON.stringify(song);
		let filePath = this.url + 'get-song-file/' + song.file;
		let imagePath = this.url + 'get-image-album/' + song.album.image;
		//guardamos en el local storage la cancion que esta sonando
		localStorage.setItem('sound_song', songPlayer);
		//cambiamos los valores que tiene en este momento el reproductor
		document.getElementById("mp3-source").setAttribute("src", filePath);
		//forzamos con 'any' a que el dato que hay en player (id que tiene la etiqueta de audio) es de tipo any
		//con 'load' cargamos la nueva url del fichero en el source y que este disponible para reproducirlo
		(document.getElementById("player") as any).load();
		//para que se reproduzca al instante
		(document.getElementById("player") as any).play();
		//le ponemos al HTML el nombre de la cancion que estamos reproduciendo
		document.getElementById('play-song-title').innerHTML = song.name;
		//idem con el nombre del artista
		document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
		//cambiamos en el src la imagen que tiene el path por la q se esta reproduciendo actualmente
		document.getElementById('play-image-album').setAttribute("src", imagePath)
	}
}