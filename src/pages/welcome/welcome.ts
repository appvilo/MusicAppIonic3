import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PlaylistPage } from '../playlist/playlist';
import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../../providers/network/network';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  count_one:any;
  count_two:any;
  count_three:any;
  count_four:any;
  count_five:any;
  count_six:any;
  networkOnlineSubscription:any;
  networkOfflineSubscription:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private http: HttpClient,
    public toast: ToastController, private network: Network,
    public networkProvider: NetworkProvider,public platform: Platform, 
    public events: Events, private databaseProvider:DatabaseProvider) {

      
      this.databaseProvider.getDatabaseState().subscribe(rdy=>{
        if(rdy){
      
        }
      })


      this.platform.ready().then(() => {
        this.networkOnlineSubscription = this.network.onConnect().subscribe(() => {
        this.events.publish('network:online', true);
        this.http.get("API").subscribe((response) => {
   

          this.count_one = response['0']['1']['count'];
          this.count_two = response['1']['2']['count'];
          this.count_three = response['2']['3']['count'];
          this.count_four = response['3']['4']['count'];
          this.count_five = response['4']['5']['count'];
          this.count_six = response['5']['6']['count'];
      
          console.log(response);
      });
      
      });
      this.networkOfflineSubscription = this.network.onDisconnect().subscribe(() => {
        this.events.publish('network:online', false);
      
        
        this.count_one = "";
        this.count_two = "";
        this.count_three = "";
        this.count_four = "";
        this.count_five = "";
        this.count_six = "";

      });
  });



  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  ionViewDidLoad() {
   

    this.http.get("API").subscribe((response) => {
   

      this.count_one = response['0']['1']['count'];
      this.count_two = response['1']['2']['count'];
      this.count_three = response['2']['3']['count'];
      this.count_four = response['3']['4']['count'];
      this.count_five = response['4']['5']['count'];
      this.count_six = response['5']['6']['count'];
  
      console.log(response);
  });




  
  }

  cooming(){
    let toast = this.toast.create({
      message: 'Скоро будет ...',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  showAlert(){
    const alert = this.alertCtrl.create({
      title: 'About us!',
      subTitle: 'Lorem ipsume text...',
      buttons: ['OK']
    });
    alert.present();
  }

  nextPage(id){
    this.navCtrl.push(PlaylistPage,{
      id:id
    })
  }

}
