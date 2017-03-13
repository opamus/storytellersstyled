import { User } from './../../providers/user';
import { ApiHelper } from './../../providers/api-helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from './../../data-model/card';
import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})
export class PlayerPage {

  @ViewChild(Content) content: Content;
  @ViewChild('focusInput') input;

  private cardData: Card;
  private commentForm: FormGroup;
  private userComment;
  private alreadyLiked;
  private comment;
  private isUser;
  private commentUser;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private apihelper: ApiHelper, private user: User,
    private zone: NgZone, private alertCtrl: AlertController) {
    this.commentUser = "default";
    this.isUser = false;
    this.cardData = this.navParams.data;
    this.alreadyLiked = false;
    this.userComment = false;
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([Validators.required, Validators.maxLength(250)])]
    });
  }

  ionViewDidLoad() {
    this.checkAlreadyLiked();
  }

  ionViewWillLoad() {
    this.comment = this.cardData.comments[this.cardData.comments.length - 1];
    if (this.user.getUser_id() == this.cardData.user_id) {
      this.isUser = true;
    }
    this.apihelper.getUser(this.comment.user_id, this.user.getToken())
    .map(res=>res.json())
    .subscribe(res=>{
      this.zone.run(()=>{
        this.commentUser = res.username;
      });
    });
  }

  public finishStory (){
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to mark this story as finished?',
      message: 'This action cannot be undone',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          handler: () => {
            this.isUser = false;
            let data = {
              file_id: this.cardData.file_id,
              tag: "Complete"
            };
            this.apihelper.tag(data, this.user.getToken())
            .subscribe(res=>{
              console.log(res);
            });
          }
        }
      ]
    });
    confirm.present();
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

  public dismissCommentSection(event) {
    this.commentForm.reset();
    this.userComment = false;
  }

  public openCommentSection(event) {
    this.userComment = true;
    this.content.scrollToBottom().then(() => {
      this.input.setFocus();
      Keyboard.show();
    });
  }

  public postComment(event) {
    let confirm = this.alertCtrl.create({
      title: 'Ready?',
      message: 'You will be unable to edit or delete your part of the story after sending it',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          handler: () => {
            let data = {
              file_id: this.cardData.file_id,
              comment: this.commentForm.controls['comment'].value
            };
            this.sendComment(data)
              .then(res => this.updateCommentUI())
              .then(res => {
                this.dismissCommentSection(event);
              });
          }
        }
      ]
    });
    confirm.present();
  }

  private checkAlreadyLiked() {
    this.cardData.likes.map(likes => {
      if (likes.user_id == this.user.getUser_id()) {
        this.alreadyLiked = true;
      }
    });
  }

  private sendComment(data) {
    return new Promise(resolve => {
      this.apihelper.postComment(data, this.user.getToken()).subscribe(res => {
        resolve();
      });
    });
  }

  private updateCommentUI() {
    return new Promise(resolve => {
      this.apihelper.getCommentsOfUser(this.user.getToken())
        .map(res => res.json())
        .subscribe(res => {
          let i = res.length - 1;
          let data = {
            comment: res[i].comment,
            comment_id: res[i].comment_id,
            file_id: res[i].file_id,
            time_added: res[i].time_added,
            user_id: res[i].user_id
          }
          this.cardData.comments.push(data);
          this.comment = data;
          resolve();
        });
    });
  }
}
