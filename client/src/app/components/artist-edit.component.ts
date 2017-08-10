import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public isEdit;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _uploadService: UploadService


	){
		this.titulo = 'Editar artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '');
		this.isEdit = true;
	}

	ngOnInit(){
		console.log('artist-edit.component.ts cargado');

		//Llamar al metodo del api para sacar un artista en base a su id getArtist
		this.getArtist();
	}

	getArtist(){
		//recogemos el id que nos llega por parametro de la url | con el metodo "forEach"
		//que genera un array con todos los parametros que hay por la url
		this._route.params.forEach((params: Params) =>{
			//accedemos al indice "id", y de este modo recogemos el id que nos llega por la url
			let id = params['id'];
			this._artistService.getArtist(this.token, id).subscribe(
				response => {
					if(!response.artist){
						this._router.navigate(['/']);
					}else{
						this.artist = response.artist;
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


	onSubmit(){
		console.log(this.artist);
		this._route.params.forEach((params: Params) =>{
			let id = params['id'];
			this._artistService.editArtist(this.token, id, this.artist).subscribe(
				response => {
					/*this.artist = response.artist;*/

					if(!response.artist){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = 'El artista se ha actualizado correctamente!';
						if(!this.filesToUpload){
							this._router.navigate(['/artista', response.artist._id]); 
						}else{
							//Subir imagen del artista
							//utilizamos el metodo "then" de la promesa
							this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, 
							[], this.filesToUpload, this.token, 'image').then(
								(result) => {
									this._router.navigate(['/artista', response.artist._id]); 
								},
								(error) => {
									console.log(error);
								}

							);
						}
						//this.artist = response.artist;
						//redirigimos a la ruta pasandole el id del artista que hemos creado
						//y asi poder añadir una imagen asociada al artista y modificar los ultimos datos
						//es tipo un asistente de creacion del artista
						/*this._router.navigate(['/editar-artista'], response.artist._id);*/ 
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

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}