import { User } from './../../providers/user';
import { ApiHelper } from './../../providers/api-helper';
import { Card } from './../../data-model/card';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-watcher',
  templateUrl: 'watcher.html'
})
export class WatcherPage {


  private cardData: Card;
  private alreadyLiked;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private apihelper: ApiHelper, private user: User,
    private zone: NgZone) {
    this.cardData = this.navParams.data;
    this.alreadyLiked = false;
  }

  ionViewDidLoad() {
    this.checkAlreadyLiked();
  }

  public postLike(event) {
    let data = {
      file_id: this.cardData.file_id
    }
    this.sendLike(data)
      .then(res => this.updateLikeUI(res))
  }

  public undoLike(event) {
    this.deleteLike()
      .then(res => this.undoLikeUI())
  }

  private undoLikeUI() {
    this.alreadyLiked = false;
    this.cardData.likes.pop();
  }

  private updateLikeUI(res) {
    this.alreadyLiked = true;
    let data = {
      favourite_id: res.favourite_id,
      user_id: this.user.getUser_id(),
      file_id: this.cardData.file_id
    }
    this.cardData.likes.push(data);
  }

  private deleteLike() {
    return new Promise(resolve => {
      this.apihelper.deleteFavourite(this.cardData.file_id, this.user.getToken())
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  private sendLike(data) {
    return new Promise(resolve => {
      this.apihelper.favourite(data, this.user.getToken())
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  private checkAlreadyLiked() {
    this.cardData.likes.map(likes => {
      if (likes.user_id == this.user.getUser_id()) {
        this.alreadyLiked = true;
      }
    });
  }

}
