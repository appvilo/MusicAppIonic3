import { Http } from '@angular/http';

import { Injectable } from '@angular/core';
import { SQLiteObject,SQLite } from '@ionic-native/sqlite';
import {BehaviorSubject} from 'rxjs/Rx';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import {Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  database:SQLiteObject;
  private databaseReady:BehaviorSubject<boolean>;

  constructor(public http: Http,private sqlitePorter:SQLitePorter, private storage: Storage, private sqlite:SQLite,
  private platform:Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name:'musics.db',
        location: 'default'
      })
      .then((db: SQLiteObject)=>{
        this.database = db;
        this.storage.get('database_filled').then(val =>{
          if(val){
            this.databaseReady.next(true);
          }else{
             this.fillDatabase();
          }
        })
      })
    })
  }

  fillDatabase() {
    this.http.get('assets/dumy.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }


 

  addDeveloperSoc(id, name,image,cat_id,sound,sound_text,time,preload){
    let data = [id, name,image,cat_id,sound,sound_text,time,preload];
    return this.database.executeSql("INSERT INTO music (music_id, name_music, image, cat_id, src, sound_text,time_music,preload) VALUES (?,?,?,?,?,?,?,?)",data).then(res =>{
      return res;
    })
  }

  deleteDrop(){
    
    return this.database.executeSql("DELETE FROM music",[]).then(res =>{
      return res;
    })
  }

  getMusicCat(cat_id){
    return this.database.executeSql("SELECT * FROM music WHERE cat_id=?",[cat_id]).then(data =>{
      let dev = [];
      if(data.rows.length>0){
        for(var i =0;i <data.rows.length;i++){
          dev.push({music_id: data.rows.item(i).music_id, name_music: data.rows.item(i).name_music, image: data.rows.item(i).image, cat_id: data.rows.item(i).cat_id
            , src: data.rows.item(i).src , sound_text: data.rows.item(i).sound_text, time_music: data.rows.item(i).time_music,  preload : data.rows.item(i).preload })
        }
      }
      return dev;
    },err =>{
      console.log("Erro",err);
      return [];
    })
  }


  getMusicId(music_id){
    return this.database.executeSql("SELECT * FROM music WHERE music_id=?",[music_id]).then(data =>{
      let dev = [];
      if(data.rows.length>0){
        for(var i =0;i <data.rows.length;i++){
          dev.push({ src: data.rows.item(i).src  })
        }
      }
      return dev;
    },err =>{
      console.log("Erro",err);
      return [];
    })
  }


  searchData(music_id){

    return this.database.executeSql("SELECT * FROM music WHERE name_music LIKE '%"+music_id+"%'",[]).then(data =>{
      let dev = [];
      if(data.rows.length>0){
        for(var i =0;i <data.rows.length;i++){
          dev.push({music_id: data.rows.item(i).music_id, name_music: data.rows.item(i).name_music, image: data.rows.item(i).image, cat_id: data.rows.item(i).cat_id
            , sound: data.rows.item(i).sound , sound_text: data.rows.item(i).sound_text, time_music: data.rows.item(i).time_music, prelaod: data.rows.item(i).preload})
        }
      }
      return dev;
    },err =>{
      console.log("Erro",err);
      return [];
    })
  }

  getDatabaseState(){
    return this.databaseReady.asObservable();
  }

}
