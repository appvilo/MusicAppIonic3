
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform, Events} from 'ionic-angular';
import { ArrayProvider } from '../../providers/array/array';
import { HttpClient } from '@angular/common/http';
import { ITrackConstraint, AudioProvider } from 'ionic-audio';
import { DatabaseProvider } from '../../providers/database/database';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { MusicControls } from '@ionic-native/music-controls';
import { Media, MediaObject } from '@ionic-native/media';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {


  item:any=[];
  id_array:any;
  id:any;
  recording: boolean = false;
  name:any;
  image:any;
  text:any;
  song:any;
  status_fav:any;
  down:any = 0;
  play:any ;
  
  group_id:any;
  name_cat:any;
  name_cat_bottom:any;
  private filemedi: MediaObject;
  currentIndex: number = -1;
  currentTrack: ITrackConstraint;
  
  storageDirectory: any;
  storageDirectoryImage: any;

  sound_name_patch:any;
  image_name_patch:any;
  duration: any = -1;
  networkOnlineSubscription:any;
  networkOfflineSubscription:any;
  get_duration_interval: any;
  array_get:any = [];

  now_play:any;
  track_duraction:any = 0;

  array_get_new:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private provider:ArrayProvider,private http: HttpClient,
    private _audioProvider: AudioProvider,private _cdRef: ChangeDetectorRef,public loadingCtrl: LoadingController,private toastCtrl: ToastController,
    private databaseProvider:DatabaseProvider,private file: File,private transfer: FileTransfer,private network: Network,
    public platform: Platform,private device: Device,public events: Events,private musicControls: MusicControls,private media: Media,
    private storage: Storage) {

      
   
      this.platform.ready().then(() => {
        if(this.platform.is('ios')) {
          this.storageDirectory = this.file.dataDirectory+"/musics/";
          this.storageDirectoryImage = this.file.dataDirectory+"/image_music/";
        } else if(this.platform.is('android')) {
          this.storageDirectory = this.file.externalDataDirectory+"/musics/";
          this.storageDirectoryImage = this.file.externalDataDirectory+"/image_music/";
        }

        this.networkOnlineSubscription = this.network.onConnect().subscribe(() => {
          this.events.publish('network:online', true);
       
         
          this.provider.getList("API").then((response)=>{

            console.log("INETTT!!!");
            console.log(response);

            this.array_get_new = response;
            this.provider.myTracks = this.array_get_new;
            
          });

    
        });


        this.networkOfflineSubscription = this.network.onDisconnect().subscribe(() => {
          this.events.publish('network:online', false);
        
             
  
        
        
          this.databaseProvider.getMusicCat(this.id).then(data =>{


            console.log("NO INETTT!!!");

            if(data.length<=0){
    
   
            this.array_get_new = null;
            this.provider.myTracks = null;
            }else if(data.length>0){
          
          
        
          this.array_get_new = data;
          this.provider.myTracks = this.array_get_new;

         
            }

           
    
          });
    
        });


      });

  }

  ionViewDidLoad() {


    this.play = "0";
    this.group_id = this.navParams.get('group_id');
     
    if (this._audioProvider.tracks.length !== 0 ) {
  
      this._audioProvider.tracks[0].stop();
       this._audioProvider.tracks.splice(0);
   }
  
    if(this.group_id==1){
      this.name_cat = "assets/imgs/play_happy.png";
      this.name_cat_bottom = "Happy";
    }else if(this.group_id==2){
      this.name_cat = "assets/imgs/morning2.png";
      this.name_cat_bottom = "Morning";
    }else if(this.group_id==3){
      this.name_cat = "assets/imgs/play_love.png";
      this.name_cat_bottom = "Love";
    }else if(this.group_id==4){
      this.name_cat = "assets/imgs/play_gym.png";
      this.name_cat_bottom = "Gym";
    }else if(this.group_id==5){
      this.name_cat = "assets/imgs/play_evening.png";
      this.name_cat_bottom = "Evening";
    }else if(this.group_id==6){
      this.name_cat = "assets/imgs/play_man.png";
      this.name_cat_bottom = "Man";
    }
  

    if(!this.isConnected()){

     
      
  this.item = this.navParams.get('item');
 

  this.id =this.item['music_id'];

  this.databaseProvider.getMusicId(this.id).then(data =>{


    if(data.length<=0){
  
  
      this.song = this.item['src'];
      this.down ="0";


    }else if(data.length>0){

  this.id_array = this.item['id_array'];
  this.name = this.item['name_music'];
  this.image =this.item['image'];
  this.text = this.item['sound_text'];
     
  this.song = data[0]["src"];
          this.down ="1";



  if(this.filemedi){

    this.filemedi.stop();
    this.filemedi.release();
    
  }
  
  this.filemedi = this.media.create(this.song);
  this.filemedi.play();
  this.filemedi.setVolume(0.0); 
  let self = this;
  this.get_duration_interval = setInterval(function() {
  if(self.duration == -1) {
    self.duration = ~~(self.filemedi.getDuration());  // make it an integer
    // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
  
  //  alert(self.duration);
  } else {
    self.filemedi.stop();
    self.filemedi.release();
    clearInterval(self.get_duration_interval);
  
  
  
  }
  }, 10);
  
  this.storage.set('music', this.id);

  this.currentTrack = this.item;
  this.currentIndex = this.id_array;
  this.settingMusicControl();
 
  this.play = "1"; 

    }
  
  });





  this.status_fav = 'NO';

    }else if(this.isConnected()){

      
  this.item = this.navParams.get('item');
  this.id_array = this.item['id_array'];
  this.id = this.item['id'];
  this.name = this.item['name'];
  this.image =this.item['image'];
  this.text = this.item['text_song'];



  this.databaseProvider.getMusicId(this.id).then(data =>{


    if(data.length<=0){
  
  
      this.song = this.item['src'];
      this.down ="0";


      

  if(this.filemedi){

    this.filemedi.stop();
    this.filemedi.release();
    
  }
  
  this.filemedi = this.media.create(this.song);
  this.filemedi.play();
  this.filemedi.setVolume(0.0); 
  let self = this;
  this.get_duration_interval = setInterval(function() {
  if(self.duration == -1) {
    self.duration = ~~(self.filemedi.getDuration());  // make it an integer
    // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
  
  //  alert(self.duration);
  } else {
    self.filemedi.stop();
    self.filemedi.release();
    clearInterval(self.get_duration_interval);
  
  
  
  }
  }, 10);
  
  this.storage.set('music', this.id);

  this.currentTrack = this.item;
  this.currentIndex = this.id_array;
  this.settingMusicControl();
 
  this.play = "1"; 

    }else if(data.length>0){
  
      this.song = data[0]["src"];
      this.down ="1";



  if(this.filemedi){

    this.filemedi.stop();
    this.filemedi.release();
    
  }
  
  this.filemedi = this.media.create(this.song);
  this.filemedi.play();
  this.filemedi.setVolume(0.0); 
  let self = this;
  this.get_duration_interval = setInterval(function() {
  if(self.duration == -1) {
    self.duration = ~~(self.filemedi.getDuration());  // make it an integer
    // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
  
  //  alert(self.duration);
  } else {
    self.filemedi.stop();
    self.filemedi.release();
    clearInterval(self.get_duration_interval);
  
  
  
  }
  }, 10);
  
  this.storage.set('music', this.id);

  this.currentTrack = this.item;
  this.currentIndex = this.id_array;
  this.settingMusicControl();
 
  this.play = "1"; 

    }
  
  });





  
  this.http.get("API").subscribe((response) => {
         
        
    this.status_fav = 'OK';
  
   
    
  });


    }


 

  
  

  }

  
  play_sound() {

this.play = "1";
//this._audioProvider.play(this.id_array);
this._audioProvider.tracks[0].play();

this.track_duraction = 0;

}



  onTrackFinished(track: any) {

    if(this.track_duraction==0){
      this.next();
    }else if(this.track_duraction==1){
      this.storage.remove("music");
    }
    
  }

  
  pause(){
    this.play = "2";

    this._audioProvider.tracks[0].pause();

    this.track_duraction = 1;
    
  }

 
  resume(){
    this.play = "1";
    this._audioProvider.tracks[0].play();

    this.track_duraction = 0;
  }


  next(){

    if(this.provider.myTracks[this.id_array+1]!=null){

      console.log("Next ->");
      console.log(this.provider.myTracks[this.id_array+1]);
      
      
      if (this._audioProvider.tracks.length !== 0 && this.provider.myTracks.length >=2) {
       
        this._audioProvider.tracks.splice(0);
    }
      
      this.play = "0"; 
      this.id_array = this.id_array+1;
      this.item = this.provider.myTracks[this.id_array];
      this.id = this.item['id'];
      this.name = this.item['name'];
      this.image =this.item['image'];
      this.text = this.item['text_song'];
      this.track_duraction = 0;
     
      this.databaseProvider.getMusicId(this.id).then(data =>{


        if(data.length<=0){
      
      
          this.song = this.item['src'];
        
          this.down ="0";
        }else if(data.length>0){
      
          this.song = data[0]["src"];
          this.down ="1";

        }
      
      });
      


      if(this.filemedi){

        this.filemedi.stop();
        this.filemedi.release();
        
      }


   this.filemedi = this.media.create(this.song);
   this.filemedi.play();
   this.filemedi.setVolume(0.0); 
   let self = this;
   this.get_duration_interval = setInterval(function() {
   if(self.duration == -1) {
     self.duration = ~~(self.filemedi.getDuration());  // make it an integer
     // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
   
   //  alert(self.duration);
   } else {
     self.filemedi.stop();
     self.filemedi.release();
     clearInterval(self.get_duration_interval);
   
   
   
   }
   }, 10);
      
   this.storage.set('music', this.id);

   this.currentTrack = this.item;
   this.currentIndex = this.id_array;
      this.settingMusicControl();
      this.play = "1"; 

     
      


    }else if(this.provider.myTracks[this.id_array+1]==null){
      
      console.log("Next ->");
      console.log(this.provider.myTracks[0]);

      if (this._audioProvider.tracks.length !== 0 && this.provider.myTracks.length >=2) {
        
         this._audioProvider.tracks.splice(0);
     }


      this.id_array = 0;
      this.play = "0"; 
      this.item = this.provider.myTracks[0];
      this.id = this.item['id'];
      this.name = this.item['name'];
      this.image =this.item['image'];
      this.text = this.item['text_song'];
  
      this.databaseProvider.getMusicId(this.id).then(data =>{


        if(data.length<=0){
      
      
          this.song = this.item['src'];
          this.down ="0";
      
        }else if(data.length>0){
      
          this.song = data[0]["src"];
          this.down ="1";
        }
      
      });

      
      if(this.filemedi){

        this.filemedi.stop();
        this.filemedi.release();
        
      }

   this.filemedi = this.media.create(this.song);
   this.filemedi.play();
   this.filemedi.setVolume(0.0); 
   let self = this;
   this.get_duration_interval = setInterval(function() {
   if(self.duration == -1) {
     self.duration = ~~(self.filemedi.getDuration());  // make it an integer
     // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
   
   //  alert(self.duration);
   } else {
     self.filemedi.stop();
     self.filemedi.release();
     clearInterval(self.get_duration_interval);
   
   
   
   }
   }, 10);
      
   this.storage.set('music', this.id);

      this.currentTrack = this.item;
      this.currentIndex = this.id_array;
      this.settingMusicControl();
      this.play = "1"; 
    

    }

    

  }

  prev(){

    

    if(this.provider.myTracks[this.id_array-1]!=null){

      console.log("Prev <-");
      console.log(this.provider.myTracks[this.id_array-1]);

     
      if (this._audioProvider.tracks.length !== 0 && this.provider.myTracks.length >=2) {
        
         this._audioProvider.tracks.splice(0);
     }
      this.id_array = this.id_array-1;
      this.play = "0"; 
      this.item = this.provider.myTracks[this.id_array];
      this.id = this.item['id'];
      this.name = this.item['name'];
      this.image =this.item['image'];
      this.text = this.item['text_song'];
      this.track_duraction = 0;

      
this.databaseProvider.getMusicId(this.id).then(data =>{


  if(data.length<=0){


    this.song = this.item['src'];
    this.down ="0";

  }else if(data.length>0){

    this.song = data[0]["src"];
    this.down ="1";
  }

});

if(this.filemedi){

  this.filemedi.stop();
  this.filemedi.release();
  
}

this.filemedi = this.media.create(this.song);
this.filemedi.play();
this.filemedi.setVolume(0.0); 
let self = this;
this.get_duration_interval = setInterval(function() {
if(self.duration == -1) {
  self.duration = ~~(self.filemedi.getDuration());  // make it an integer
  // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe

//  alert(self.duration);
} else {
  self.filemedi.stop();
  self.filemedi.release();
  clearInterval(self.get_duration_interval);



}
}, 10);
      
this.storage.set('music', this.id);

      this.currentTrack = this.item;
      this.currentIndex = this.id_array;
      this.settingMusicControl();
      this.play = "1";
    

    }else if(this.provider.myTracks[this.id_array-1]==null){
      
      
      console.log("Prev <-");
      console.log(this.provider.myTracks[this.provider.array_get.length-1]);

      if (this._audioProvider.tracks.length !== 0 && this.provider.myTracks.length >=2) {
        
         this._audioProvider.tracks.splice(0);
     }

      this.id_array = this.provider.array_get.length-1;
      this.item = this.provider.myTracks[this.id_array]
      this.play = "0";
      this.id = this.item['id'];
      this.name = this.item['name'];
      this.image =this.item['image'];
      this.text = this.item['text_song'];
      
      this.databaseProvider.getMusicId(this.id).then(data =>{


        if(data.length<=0){
      
      
          this.song = this.item['src'];
        
          this.down ="0";
        }else if(data.length>0){
      
          this.song = data[0]["src"];
          this.down ="1";
        }
      
      });

      if(this.filemedi){

        this.filemedi.stop();
        this.filemedi.release();
        
      }
      
   this.filemedi = this.media.create(this.song);
   this.filemedi.play();
   this.filemedi.setVolume(0.0); 
   let self = this;
   this.get_duration_interval = setInterval(function() {
   if(self.duration == -1) {
     self.duration = ~~(self.filemedi.getDuration());  // make it an integer
     // self.duration_string = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
   
   //  alert(self.duration);
   } else {
     self.filemedi.stop();
     self.filemedi.release();
     clearInterval(self.get_duration_interval);
   
   
   
   }
   }, 10);
      
   this.storage.set('music', this.id);

      this.currentTrack = this.item;
      this.currentIndex = this.id_array;
      this.settingMusicControl();
      this.play = "1";
    }



  }

  unlike(){

    this.http.get("API").subscribe((response) => {
 

  this.status_fav = response;

  console.log(response);

  this.http.get("API").subscribe((response) => {
 

    this.status_fav = response["status"];
  
    console.log(response);
  });

});
  }

  like(){

    this.http.get("API").subscribe((response) => {
 

      this.status_fav = response;
    
      console.log(response);
  
      this.http.get("API").subscribe((response) => {
   
  
        this.status_fav = response["status"];
      
        console.log(response);
      });
  
    });

  }



  download_mus(){


    if(!this.isConnected()){ 


      let toast = this.toastCtrl.create({
        message: 'Нет интернет соединения',
        duration: 3000,
        position: 'bottom'
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
  
    }else if(this.isConnected()){
    console.log("not found! download!");
    let loading = this.loadingCtrl.create({
      content: 'Downloading the song from the web...'
    });
    loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(this.song, this.storageDirectory + this.id+"_sound.mp3").then((entry) => {
      console.log('download complete' + entry.toURL());



   
      this.sound_name_patch = this.storageDirectory + this.id+"_sound.mp3";
      this.image_name_patch = this.image;
      var time = "17:00";
      var meta = "metadata";

      //insert to DB
      this.databaseProvider.addDeveloperSoc(this.id, this.name,this.image_name_patch,this.group_id,this.sound_name_patch, this.text,time,meta ).then(data =>{

        
      loading.dismiss();
    
      this. presentToast2();
      this.down ="1";

 
      

      },err=>{
        console.log("Not insert !");
        loading.dismiss();
        console.log(err);
      });



    }).catch(err_2 => {
      console.log("Download error!");
      loading.dismiss();
      console.log(err_2);
    });

  
  
}
  }

  presentToast2() {
    let toast = this.toastCtrl.create({
      message: 'Music downloaded successfully!',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  stopRecord() {
    this.recording = false;

  }

  startRecord(){
    this.recording = true;
  }


  settingMusicControl(){
    this.musicControls.destroy(); // it's the same with or without the destroy 
    this.musicControls.create({
      track       : this.name,        // optional, default : ''
      artist      : this.name_cat_bottom,                       // optional, default : ''
      cover       : this.image,      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying   : true,                         // optional, default : true
      dismissable : true,                         // optional, default : false
    
      // hide previous/next/close buttons:
      hasPrev   : true,      // show previous button, optional, default: true
      hasNext   : true,      // show next button, optional, default: true
      hasClose  : true,       // show close button, optional, default: false
      hasSkipForward : false,  // show skip forward button, optional, default: false
      hasSkipBackward : false, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
    // iOS only, optional
      album       : this.name_cat_bottom,     // optional, default: ''
      duration : this.duration, // optional, default: 0
      elapsed : 10, // optional, default: 0
    
      // Android only, optional
      // text displayed in the status bar when the notific\ation (and the ticker) are updated
      ticker    : 'Now playing '+this.name
     });
     this.musicControls.subscribe().subscribe((action) => {
      console.log('action', action);
          const message = JSON.parse(action).message;
          console.log('message', message);
          switch(message) {
            case 'music-controls-next':
               // Do something
               console.log('music pause');
              this.next();
               break;
            case 'music-controls-previous':
               // Do something
               console.log('music play');
            this.prev();
               break;
            case 'music-controls-pause':
               // Do something
               this.play = "2";
               this.musicControls.listen(); 
               this.musicControls.updateIsPlaying(false);
               console.log('music pause');
               this.pause();
             
               break;
            case 'music-controls-play':
               // Do something
               this.play = "1";
               this.musicControls.listen(); 
               this.musicControls.updateIsPlaying(true);
               console.log('music play');
               this.resume();
               
               break;
            case 'music-controls-destroy':
               // Do something
  
               this.play = "0";
               this.track_duraction = 1;
               this._audioProvider.tracks[0].stop();
               this.musicControls.listen(); 
               this.musicControls.destroy();
              this.storage.remove("music");
               this.platform.exitApp();
               break;
  
            // External controls (iOS only)
            case 'music-controls-toggle-play-pause' :
              // Do something
              break;
            case 'music-controls-seek-to':
              // Do something
              break;
            case 'music-controls-skip-forward':
              // Do something
              break;
            case 'music-controls-skip-backward':
              // Do something
              break;
  
              // Headset events (Android only)
              // All media button events are listed below
            case 'music-controls-media-button' :
                // Do something
                break;
            case 'music-controls-headset-unplugged':
                // Do something
                break;
            case 'music-controls-headset-plugged':
                // Do something
                break;
            default:
                break;
          }
    });
    this.musicControls.listen(); // activates the observable above
    this.musicControls.updateIsPlaying(true);
  }

}
