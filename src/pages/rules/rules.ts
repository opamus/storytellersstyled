import { AuthenticationPage } from './../authentication/authentication';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-rules',
  templateUrl: 'rules.html'
})
export class RulesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private storage: Storage) {}


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
