import { WatcherPage } from './../watcher/watcher';
import { Keyboard } from 'ionic-native';
import { ArchiveState } from './../../providers/archive-state';
import { User } from './../../providers/user';
import { ApiHelper } from './../../providers/api-helper';
import { Card } from './../../data-model/card';
import { AuthenticationPage } from './../authentication/authentication';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, Content } from 'ionic-angular';

@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html'
})
export class ArchivePage {

  @ViewChild(Content) content: Content;
  private filter;
  private isScrollUp: boolean;
  private list: Card[];
  private searchInput: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
    private storage: Storage, private zone: NgZone, private apihelper: ApiHelper,
    private user: User, private archiveState: ArchiveState) {
    this.filter = "Date";
    this.isScrollUp = false;
    this.searchInput = ""
  }

  ionViewWillEnter() {
    this.filter = "Date";
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.archiveState.clearState();
    this.getMediaList(loader)
      .then(res => {
        console.log(this.archiveState.mediaList);
        this.list = this.archiveState.mediaList;
      });
  }

  public doSearch(event) {
    this.list = this.archiveState.mediaList;
    let searchValue: string = event.target.value;
    if (searchValue && searchValue.trim() != '') {
      this.list = this.archiveState.mediaList.filter((item) => {
        return (item.title.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1);
      });
    }
  }

  public doClear(event) {
    this.list = this.archiveState.mediaList;
    Keyboard.close();
  }

  public refresh(event) {
    this.filter = "Date";
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.archiveState.clearState();
    this.getMediaList(loader)
      .then(res => {
        console.log(this.archiveState.mediaList);
        this.list = this.archiveState.mediaList;
        event.complete();
      });
  }


  private getMediaList(loader) {
    return new Promise(resolve => {
      this.apihelper.getFilesByTag("Storytime")
        .map(res => res.json())
        .subscribe(mediaList => {
          this.archiveState.listLength = mediaList.length;
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
      let media: Card = mediaList[this.archiveState.index];
      if (media == null) {
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
        if (card.isComplete) {
          this.archiveState.mediaList.unshift(card);
        }
        this.archiveState.index = this.archiveState.index + 1;
        if (this.archiveState.index == this.archiveState.listLength) {

          loader.dismiss();

          resolve();
        } else {
          this.extractData(mediaList, loader);
          resolve();
        }
      });
    });

  }


  public selectedDate() {
    console.log("Date filter");
    this.list.sort((media1, media2) => {
      return media2.file_id - media1.file_id;
    });

    console.log(this.list);
    console.log(this.archiveState.mediaList);
  }

  public selectedLikes() {
    console.log("Likes filter");
    this.list.sort((media1, media2) => {
      return media2.likes.length - media1.likes.length;
    });

    console.log(this.list);
    console.log(this.archiveState.mediaList);
  }

  public selectedName() {
    console.log("Name filter");
    this.list.sort((media1, media2) => {
      if (media2.title.toLocaleLowerCase() > media1.title.toLocaleLowerCase()) {
        return -1;
      } else if (media2.title.toLocaleLowerCase() < media1.title.toLocaleLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    console.log(this.list);
    console.log(this.archiveState.mediaList);
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


  public goUp(event) {
    this.content.scrollToTop().then(res => {
      this.isScrollUp = false;
    });
  }

  public view(card) {
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading data'
    });
    loader.present();
    this.navCtrl.push(WatcherPage, card).then(() => {
      loader.dismiss();
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

}
