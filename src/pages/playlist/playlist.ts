import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform,  LoadingController } from 'ionic-angular';
import { PlayerPage } from '../player/player';
import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { PlayerDownloadedPage } from '../player-downloaded/player-downloaded';
import { ArrayProvider } from '../../providers/array/array';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the PlaylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html',
})
export class PlaylistPage {

  id:any;
  items:any;

  con:boolean;
  networkOnlineSubscription:any;
  networkOfflineSubscription:any;
  name_cat_bottom:any;


  public searchBar = false;
  queryText:string;


  //send intent
  array_intent:any =[];
  array_intent_get:any =[];
  array_get:any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HttpClient, private network: Network,public platform: Platform, 
    public events: Events,private provider:ArrayProvider,public loadingCtrl: LoadingController, private databaseProvider:DatabaseProvider) {


      this.platform.ready().then(() => {
      

        this.networkOnlineSubscription = this.network.onConnect().subscribe(() => {
          this.events.publish('network:online', true);
       
         
          this.provider.getList("API").then((response)=>{

            console.log("INETTT!!!");
            console.log(response);

            this.items = response;
        
            
          });

    
        });


        this.networkOfflineSubscription = this.network.onDisconnect().subscribe(() => {
          this.events.publish('network:online', false);
        
             
  
        
        
          this.databaseProvider.getMusicCat(this.id).then(data =>{


            console.log("NO INETTT!!!");

            if(data.length<=0){
    
   
            this.items = null;
            this.provider.myTracks = null;
            }else if(data.length>0){
          
          
        
          this.items = data;
          this.array_get = data;
          this.provider.myTracks = this.array_get;

         
            }

           
    
          });
    
        });


      });

  }


  cancelSearch(){

    this.searchBar=false;
    this.ionViewDidLoad();

  }


 updateText(ev){
 
  
    if(this.queryText.length > 0 ){


      this.http.get("API").subscribe((response) => {
   


        console.log(response);
    
        this.items = response;
        this.provider.myTracks = this.items;
    });



  }else if(this.queryText.length <= 0){
    this.ionViewDidLoad();
  }

  }


  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  ionViewDidLoad() {
    


    if(!this.isConnected()){

      this.id = this.navParams.get('id');



      let loading = this.loadingCtrl.create({
        content: 'Загрузка списка...'
      });
      loading.present();


      this.databaseProvider.getMusicCat(this.id).then(data =>{


        console.log("NO INETTT!!!");

        if(data.length<=0){


        this.items = null;
        this.provider.myTracks = null;
        }else if(data.length>0){
      
      
    
      this.items = data;
      this.array_get = data;
      this.provider.myTracks = this.array_get;

     
        }

        loading.dismiss();

       

      });

    }else if(this.isConnected()){


      this.id = this.navParams.get('id');



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
   



  }

  showAlert() {
 this.navCtrl.pop();
  }

  nextPage(item){


  

if(!this.isConnected()){


   
this.navCtrl.push(PlayerPage,{
  item:item,
  group_id:this.id,
  
});

}
else if(this.isConnected()){

   
this.navCtrl.push(PlayerPage,{
  item:this.provider.myTracks[item['id_array']],
  id_array:item['id_array'],
  group_id:this.id,
  
});

}


  }

}
