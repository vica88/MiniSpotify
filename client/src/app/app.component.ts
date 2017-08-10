import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//ES UN SOLO PUNTO PORQUE ESTAMOS EN LA RAIZ DEL APP Y NO ESTAMOS DENTRO DE NINGUNA CARPETA
import {GLOBAL} from './services/global';
//importamos el servicio user.service.ts
import { UserService} from './services/user.service';
import {User} from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //providers -> se cargan todos los servicios que queramos 
  providers: [UserService]
  /*styleUrls: ['./app.component.css']*/
})
//con implements OnInit vamos a formar que exista, es una buena practica
export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  //objeto user
  public user: User;
  public user_register: User;
  //objeto que vamos a utilizar el databinding y modificar las propiedad de ese objeto
  //para poder luego enviar un objeto relleno al api
  //Con identity comprobamos los datos del usuario logueado, si es true estamos logueados (rellena)
  public identity;
  //tanto el identity como el token estan guardados en el local storage
  public token;
  //creamos la propiedad
  public errorMessage;
  public alertRegister;
  public url;
  
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    ){
      //asignamos un valor al objeto de usuario
  	  this.user = new User('','','','','','ROLE_USER','');
      //se hace otro user porque sino se llenan los mismos campos en login y registro(correo electronico y contraseña)
      this.user_register = new User('','','','','','ROLE_USER','');
      this.url = GLOBAL.url;
  }

  //en vez de cargar un componente, ejecuta el codigo que nosotros queramos o le indiquemos
  ngOnInit(){
    //asignamos un valor a las propiedades 'identity' y 'token'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }


  //this.user es el objeto que se esta modificando con el two data biding
  public onSubmit(){
    console.log(this.user);
    //hacemos la llamada al metodo del servicio | utilizamos el metodo "subscribe" para suscribirnos al
    //observable
    //Conseguimos los datos del usuario identificado
    this._userService.singUp(this.user).subscribe(
      response => {
        //comprobamos si la informacion que nos devuelve el api es correcta | response.user guardamos el usuario que se
        //se ha logueado
        let identity = response.user;
        //this.identity contiene el valor del usuario que se ha logueado en esta peticion ajax (que devuelve el api)
        this.identity = identity;
        if(!this.identity._id){
          alert("El usuario no está correctamente logueado");
        }else{
          //crear elemento en el localstorage para tener al usuario sesion
          localStorage.setItem('identity', JSON.stringify(identity));

          //Conseguir el token para enviarselo a cada peticion http, y luego comprobar si es correcto para saber si el
          //usuario esta logueado correctamente o no
            this._userService.singUp(this.user, 'true').subscribe(
              response => {
                //comprobamos si la informacion que nos devuelve el api es correcta | response.user guardamos el usuario que se
                //se ha logueado
                let token = response.token;
                //this.identity contiene el valor del usuario que se ha logueado en esta peticion ajax (que devuelve el api)
                this.token = token;
                if(this.token.lenght <= 0){
                  alert("El token no se ha generado correctamente");
                }else{
                  //crear elemento en el localstorage para tener token disponible
                  //no tenemos que convertir el token a string, porque ya es un string
                  localStorage.setItem('token', token);  
                  //creamos una instancia del objeto user, para no tener conflicto a la hora de volver a loguearnos
                  this.user = new User('','','','','','ROLE_USER','');

                  //Conseguir el token para enviarselo a cada peticion http, y luego comprobar si es correcto para saber si el
                  //usuario esta logueado correctamente o no
                  //para ver que realmente se han identificado y son los datos correctos    
                /*  console.log(token);
                  console.log(identity);*/
                }
              },
              error => {
                //mostramos el error | guardamos datos del tipo "any"
                var errorMessage = <any>error;

                if(errorMessage != null){
                  //parseamos a json a objeto real el body
                  var body = JSON.parse(error._body);
                  this.errorMessage = body.message;
                  console.log(error);
                }
              });
            }
          },
      error => {
        //mostramos el error | guardamos datos del tipo "any"
        var errorMessage = <any>error;

        if(errorMessage != null){
          //parseamos a json a objeto real el body
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      });
  }

    logout(){
    //clear lo que hace es un sesion destroy global, elimina todo lo q hay en el localStorage
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    //para que la sesion se cierre visualmente y salgamos de la parte privada (la que necesita identity) y nos
    //muestre denuevo los formularios "registro" y "loguin"
    this.identity = null;
    this.token = null;
    //hacemos una redireccion al hacer "logout"
    this._router.navigate(['/']);
  }

  

  onSubmitRegister(){
    console.log(this.user_register);
    //le pasamos user_register asi guarda el usuario registrado y lo guarda en la BD
    this._userService.register(this.user_register).subscribe(
      response => {
        //dentro vamos a guardar el usario q nos devuelve la BD, si el api nos devuelve un objeto de user
        //es que todo ha ido bien y nos hemos registrado correctamente
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+this.user_register.email;
          //limpiamos los datos del formulario, para vaciarlo y poder crear otro usuario nuevo
          this.user_register = new User('','','','','','ROLE_USER','');
        }

      },
      error => {
        //mostramos el error | guardamos datos del tipo "any"
        var errorMessage = <any>error;

        if(errorMessage != null){
          //parseamos a json a objeto real el body
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      });
  }

}
