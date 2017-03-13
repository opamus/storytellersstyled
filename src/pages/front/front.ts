import { PlayerPage } from './../player/player';
import { UploadPage } from './../upload/upload';
import { FrontState } from './../../providers/front-state';
import { AuthenticationPage } from './../authentication/authentication';
import { ApiHelper } from './../../providers/api-helper';
import { Card } from './../../data-model/card';
import { User } from './../../providers/user';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, LoadingController, Content } from 'ionic-angular';

@Component({
  selector: 'page-front',
  templateUrl: 'front.html'
})
export class Front {

  @ViewChild(Content) content: Content;

  private isScrollUp: boolean;

  constructor(public navCtrl: NavController, private storage: Storage, private user: User,
    private apihelper: ApiHelper, private loadingCtrl: LoadingController, private zone: NgZone,
    private state: FrontState) {
    this.isScrollUp = false;
  }

  // ionViewDidLoad() {
  //   let loader = this.loadingCtrl.create({
  //     spinner: 'circles',
  //     content: 'Loading data'
  //   });
  //   loader.present();
  //   this.state.clearState();
  //   this.getMediaList(loader)
  //     .then(res => {
  //       console.log(this.state.mediaList);
  //     });
  // }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.state.clearState();
    this.getMediaList(loader)
      .then(res => {
        console.log(this.state.mediaList);
      });
  }

  ionViewDidEnter() {
    this.content.ionScrollEnd.subscribe(res => {
      if (res.directionY === 'up' && res.scrollTop > 500) {
        this.zone.run(() => {
          this.isScrollUp = true;
        });
      } else {
        this.zone.run(() => {
          this.isScrollUp = false;
        });
      }
    });
  }

  public upload(event) {
    this.navCtrl.push(UploadPage);
  }

  public refresh(event) {
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.state.clearState();
    this.getMediaList(loader)
      .then(res => {
        console.log(this.state.mediaList);
        event.complete();
      });
  }


  public goUp(event) {
    this.content.scrollToTop().then(res => {
      this.isScrollUp = false;
    });
  }

  public logOut(event) {
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.storage.clear()
      .then(res => this.navCtrl.setRoot(AuthenticationPage))
      .then(res => { loader.dismiss() });
  }

  public view(card) {
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.navCtrl.push(PlayerPage, card).then(() => {
      loader.dismiss();
    });
  }

  private getMediaList(loader) {
    return new Promise(resolve => {
      this.apihelper.getFilesByTag("Storytime")
        .map(res => res.json())
        .subscribe(mediaList => {
          this.state.listLength = mediaList.length;
          this.extractData(mediaList, loader)
            .then(res => {
              resolve();
            });
        });
    });
  }

  private extractData(mediaList, loader) {
    return new Promise(resolve => {
      let card: Card = new Card(this.apihelper, this.user);
      let media: Card = mediaList[this.state.index];
      if (!media) {
        resolve();
      }
      card.setDescription(media.description);
      card.setFile_id(media.file_id);
      card.setMedia_type(media.media_type);
      card.setMime_type(media.mime_type);
      card.setTime_added(media.time_added);
      card.setTitle(media.title);
      card.setUser_id(media.user_id);
      card.setFile_name(media.filename);
      card.processData().then(res => {
        if (!card.isComplete) {

          this.state.mediaList.unshift(card);

        }
        this.state.index = this.state.index + 1;
        if (this.state.index === this.state.listLength) {

          loader.dismiss();

          resolve();
        } else {
          this.extractData(mediaList, loader);
          resolve();
        }
      });
    });

  }

}
