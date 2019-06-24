import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FavouritePage } from '../pages/favourite/favourite';
import { WelcomePage } from '../pages/welcome/welcome';
import { PlaylistPage } from '../pages/playlist/playlist';
import { PlayerPage } from '../pages/player/player';

import { File } from '@ionic-native/file';

import { VoicePage } from '../pages/voice/voice';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { NetworkProvider } from '../providers/network/network';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { DatabaseProvider } from '../providers/database/database';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { PlayerDownloadedPage } from '../pages/player-downloaded/player-downloaded';
import {HttpModule} from '@angular/http';
import { MusicControls } from '@ionic-native/music-controls';
import { Device } from '@ionic-native/device';
import { Media} from '@ionic-native/media';
import { IonicAudioModule, WebAudioProvider, CordovaMediaProvider, defaultAudioProviderFactory } from 'ionic-audio';
import { ArrayProvider } from '../providers/array/array';
import { IonicStorageModule } from '@ionic/storage';

export function myCustomAudioProviderFactory() {
  return (window.hasOwnProperty('cordova')) ? new CordovaMediaProvider() : new WebAudioProvider();
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    FavouritePage,
    WelcomePage,
    PlaylistPage,
    PlayerPage,
    VoicePage,
    PlayerDownloadedPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    BrowserModule,
    IonicStorageModule.forRoot(),
   
    IonicAudioModule.forRoot(defaultAudioProviderFactory), 
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    FavouritePage,
    AboutUsPage,
    WelcomePage,
    PlaylistPage,
    PlayerPage,
    VoicePage,
    PlayerDownloadedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileTransfer,
    FileTransferObject,
    NetworkProvider,
    Network,
    SQLite,
    DatabaseProvider,
    SQLitePorter,
    MusicControls,
    Device,
    ArrayProvider,
    Media
    
  
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
