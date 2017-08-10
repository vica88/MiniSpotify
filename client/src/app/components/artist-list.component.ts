import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-list.html',
	providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit{
	public titulo: string;
	public artists: Artist[];
	public identity;
	public token;
	public url: string;
	public nextPage;
	public prevPage;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService

	){
		this.titulo = 'Artistas';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.nextPage = 1;
		this.prevPage = 1;
	}

	ngOnInit(){
		console.log('artist-list.component.ts cargado');

		//Conseguir el listado de artistas
		this.getArtists();
	}

	getArtists(){
		this._route.params.forEach((params: Params) => {
			//recogemos el paremetro page de la url || con '+' lo convertimos a un numero
			let page = +params['page'];
			if(!page){
				page = 1;
			}else{
				//con esto controlamos la paginacion
				this.nextPage = page + 1;
				this.prevPage = page - 1;
				//esto lo hacemos para que en la navegacion de la paginacion 
				//nunca nos de un nro inferior a 0, que ahi no nos devolveria ningun registro 
				if(this.prevPage == 0){
					this.prevPage = 1;
				}
			}

			this._artistService.getArtists(this.token, page).subscribe(
				response => {
					if(!response.artists){
						this._router.navigate(['/']);
					}else{
						this.artists = response.artists;
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

	//Metodos para borrar o cancelar el borrado de un artista
	public confirmado;
	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelArtist(){
		this.confirmado = null;
	}

	onDeleteArtist(id){
		this._artistService.deleteArtist(this.token, id).subscribe(
			response => {
				if(!response.artist){
					alert('Error en el servidor');
				}
				this.getArtists();
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
	};
}