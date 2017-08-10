//nos sirve para el doble data biding
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders} from './app.routing';

//importamos la clase del componente

//general
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

//user
import { UserEditComponent } from './components/user-edit.component';

//artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

//player
import { PlayerComponent } from './components/player.component';

@NgModule({
  //cargamos componentes y directivas
  declarations: [
    AppComponent,
    //cargamos el objeto, para que me permita acceder a sus directivas dentro de cualquier otro componente
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  //cargamos modulos del framework o que hagamos nosotros
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  //cargamos servicios
  providers: [appRoutingProviders],
  //punto principal donde carga la aplicacion, en este caso decimos cual es el componente principal
  //en este caso el AppComponent
  bootstrap: [AppComponent]
})
export class AppModule { }
