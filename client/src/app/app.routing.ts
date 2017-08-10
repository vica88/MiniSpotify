//importa componentes y modulos y funcionalidades que tiene el router
import { ModuleWithProviders } from '@angular/core';

import { Routes, RouterModule} from '@angular/router';

//importamos los componentes que tienen que ver con el home
import { HomeComponent } from './components/home.component';

//importamos los componentes que tienen que ver con el usuario
import { UserEditComponent } from './components/user-edit.component';
//importamos los componentes que tienen que ver con el artista
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//importamos los componentes que tienen que ver con el album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//importamos los componentes que tienen que ver con el song(cancion)
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

//definimos un array "appRoutes" con todas nuestras configuraciones de rutas

const appRoutes: Routes = [
/*	{
		//redireccionamos al fichero por defecto a "artists/1"
		path:'',
		redirectTo: '/artists/1',
		pathMatch:'full',
	},*/
	//path de rutas
	{path: '', component: HomeComponent},
	{path: 'artistas/:page', component: ArtistListComponent},
	{path: 'crear-artista', component: ArtistAddComponent},
	{path: 'editar-artista/:id', component: ArtistEditComponent},
	{path: 'artista/:id', component: ArtistDetailComponent},
	{path: 'crear-album/:artist', component: AlbumAddComponent},
	{path: 'editar-album/:id', component: AlbumEditComponent},
	{path: 'album/:id', component: AlbumDetailComponent},
	{path: 'crear-tema/:album', component: SongAddComponent},
	{path: 'editar-tema/:id', component: SongEditComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: '**', component: HomeComponent}	

];

//configuracion necesaria para el router
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
