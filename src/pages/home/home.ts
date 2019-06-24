import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  slides = [
    {
      title: "Welcome to the MusicApp!",
      description: "The <b>MusicApp</b> showcases a number of useful components that are included out of the box with MusicApp<.",
      image: "assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "What is MusicApp?",
      description: "<b>MusicApp</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/imgs/ica-slidebox-img-2.png",
    },
    {
      title: "What is MusicApp?",
      description: "The <b>MusicApp</b> is a cloud platform for managing and scaling MusicApp apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/imgs/ica-slidebox-img-3.png",
    }
  ];

  constructor(public navCtrl: NavController) {

  }

  nextPage(){
    this.navCtrl.setRoot(WelcomePage);
  }

}
