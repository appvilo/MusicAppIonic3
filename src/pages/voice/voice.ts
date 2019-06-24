import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the VoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-voice',
  templateUrl: 'voice.html',
})
export class VoicePage {

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
 
    private file: File,
    public platform: Platform,
    private toastCtrl: ToastController,
    private media: Media) {
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Record was added successfully',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewWillEnter() {
    this.getAudioList();
  }

  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'Record - '+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.m4a';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'Record - '+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
    this.presentToast();
  }


  playAudio(file,idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  stopAudio() {
    this.audio.stop();
  }


}
