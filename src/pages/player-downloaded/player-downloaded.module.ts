import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerDownloadedPage } from './player-downloaded';

@NgModule({
  declarations: [
    PlayerDownloadedPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerDownloadedPage),
  ],
})
export class PlayerDownloadedPageModule {}
