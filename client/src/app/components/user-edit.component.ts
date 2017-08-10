//modulos del core de angular
import {Component, OnInit}from '@angular/core';

import {GLOBAL} from '../services/global';
//el servicio
import {UserService} from '../services/user.service';
//cargamos el modelo
import {User} from '../models/user';

//indicamos los metadatos que va a tener este componente
@Component({
	//se carga dentro de la etiqueta
	selector: 'user-edit',
	//carga una plantilla con el html
	templateUrl: '../views/user-edit.html',
	//va a utilizar servicios, los cargamos
	providers: [UserService]
})

//implementamos OnInit para obligarnos a tener el metodo que es muy util
export class UserEditComponent implements OnInit{
	public titulo: string;
	//usuario a cargar 
	public user: User;
	public identity;
	public token;
	public alertMessage;
	public url: string;

	//cargamos el servicio
	constructor(
		private _userService: UserService
	){
		this.titulo = 'Actualizar mis datos';
		this.identity = this._userService.getIdentity();
    	this.token = this._userService.getToken();
    	//cuando carguemos el formulario, automaticamente el objeto user ya va a estar relleno y ya vamos a tener 
    	//esos valores guardados en el objeto y en el formulario se van a visualizar esos valores de c/u de las 
    	//propuedades que estamos utilizando
    	this.user = this.identity;
    	this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('user-edit.component.ts cargado');
	}

	onSubmit(){
		console.log(this.user);

		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
					this.alertMessage = 'El usuario no se ha actualizado';
				}else{
					/*this.user = response.user;*/
					localStorage.setItem('identity', JSON.stringify(this.user));
					//seleccionamos el nombre de usuario por su id (identityName)
					//y le cambiamos el valor por el que tenemos en la propiedad user
					//y asi se cambia dinamicamente cuando actualizamos los datos del usuario
					document.getElementById('identityName').innerHTML = this.user.name;
					if(!this.filesToUpload){
						//Redireccion
					}else{
						this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
							(result: any) => {
								this.user.image = result.image;
								//lo volvemos a actualizar al localStorage
								localStorage.setItem('identity', JSON.stringify(this.user));
								//construimos la url que lleva el metodo de la api "get-image-user"
								let imagePath = this.url+'get-image-user/'+this.user.image;
								document.getElementById('image-logged').setAttribute('src', imagePath);
							}
						);
					}
					
					this.alertMessage = 'Datos actualizados correctamente';
				}
			},
			error => {
            	//mostramos el error | guardamos datos del tipo "any"
                var errorMessage = <any>error;

                if(errorMessage != null){
                  //parseamos a json a objeto real el body
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                  console.log(error);
                }
            }
        );
	}

	public filesToUpload: Array<File>;
	//se lanzara en el evento input
	fileChangeEvent(fileInput: any){
		//recoge los archivos que se han seleccionado en el input y posteriormente subirlos
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
	//hacemos una peticion ajax para subir ficheros convencionales
	makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		//necesitamos el token del usuario logueado para que nos deje subirle su imagen
		var token = this.token;
		//lanza el codigo de la subida
		return new Promise(function(resolve, reject){
			//simulamos el comportamiento de un formulario normal
			var formData: any = new FormData();
			//peticion ajax de JS tipica
			var xhr = new XMLHttpRequest();
			//recorremos los ficheros que recibimos por el array
			for(var i = 0; i < files.length; i++){
				//añadimos con el name image| le pasamos el file que este en el momento | y el nombre
				formData.append('image', files[i], files[i].name);
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