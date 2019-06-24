import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITrackConstraint } from 'ionic-audio';
import { DatabaseProvider } from '../database/database';
/*
  Generated class for the ArrayProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ArrayProvider {

  myTracks: ITrackConstraint[];
  array_get:any =[];

  constructor(public http: HttpClient,private databaseProvider:DatabaseProvider) {
    console.log('Hello ArrayProvider Provider');
  }


  getList(url){

    this.http.get(url).subscribe((response) => {
   
      this.array_get = response;



        this.myTracks = this.array_get;




      console.log(this.myTracks);

 });

 return this.http.get(url).toPromise();

  }

  getSqlList(id){

   return this.databaseProvider.getMusicCat(id);

  }

}
