import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService

	){
		this.titulo = 'Crear nuevo artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '');
	}

	ngOnInit(){
		console.log('artist-add.component.ts cargado');

		//Conseguir el listado de artistas
	}

	
	onSubmit(){
		console.log(this.artist);
		this._artistService.addArtist(this.token, this.artist).subscribe(
			response => {
				this.artist = response.artist;

				if(!response.artist){
					this.alertMessage = 'Error en el servidor';
				}else{
					this.alertMessage = 'El artista se ha creado correctamente!';
					this.artist = response.artist;
					//redirigimos a la ruta pasandole el id del artista que hemos creado
					//y asi poder añadir una imagen asociada al artista y modificar los ultimos datos
					//es tipo un asistente de creacion del artista
					this._router.navigate(['/editar-artista', response.artist._id]);
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
}