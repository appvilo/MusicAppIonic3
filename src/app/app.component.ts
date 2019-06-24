import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AboutUsPage } from '../pages/about-us/about-us';
import { FavouritePage } from '../pages/favourite/favourite';
import { WelcomePage } from '../pages/welcome/welcome';
import { PlayerPage } from '../pages/player/player';
import { VoicePage } from '../pages/voice/voice';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private storage: Storage) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Категории', component: WelcomePage},
      { title: 'О нас', component: AboutUsPage },
      { title: 'Избранное', component: FavouritePage },
      { title: 'Запись голоса', component: VoicePage }
    ];




  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.remove("music");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
