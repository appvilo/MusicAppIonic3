import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { PlayerPage } from '../player/player';
import { Network } from '@ionic-native/network';
import { Device } from '@ionic-native/device';
import { ArrayProvider } from '../../providers/array/array';
/**
 * Generated class for the FavouritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html',
})
export class FavouritePage {

  
  items:any;

  con:boolean;
  networkOnlineSubscription:any;
  networkOfflineSubscription:any;
  divice:any = "4";

  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HttpClient, private network: Network,public platform: Platform, 
    public events: Events,private device: Device,private provider:ArrayProvider,public loadingCtrl: LoadingController) {

    this.platform.ready().then(() => {
      this.networkOnlineSubscription = this.network.onConnect().subscribe(() => {
      this.events.publish('network:online', true);
   
      this.con=true;

        this.http.get("API").subscribe((response) => {
 


      console.log(response);
    
      this.items = response;
    });

    });
    this.networkOfflineSubscription = this.network.onDisconnect().subscribe(() => {
      this.events.publish('network:online', false);
    
      
this.con=false;

    });
});

  }


  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  ionViewDidLoad() {

  

     let loading = this.loadingCtrl.create({
       content: 'Загрузка списка...'
     });
     loading.present();
 
 this.provider.getList("API").then((response)=>{
 
 
   console.log(response);
 
   this.items = response;
 
   loading.dismiss();
   
 });



  }

  nextPage(item){
    this.navCtrl.push(PlayerPage,{
      item:this.provider.myTracks[item['id_array']]
      
    });
    
  }

}
