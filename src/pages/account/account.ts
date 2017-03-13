import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHelper } from './../../providers/api-helper';
import { User } from './../../providers/user';
import { AuthenticationPage } from './../authentication/authentication';
import { Storage } from '@ionic/storage';
import { Component, Renderer } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  private username: string;
  private email: string;
  private accountForm: FormGroup;
  private icon: string[];

  constructor(public navCtrl: NavController, private storage: Storage, private loadingCtrl: LoadingController,
    private user: User, private apihelper: ApiHelper, private formBuilder: FormBuilder, private renderer: Renderer) {
    this.username = this.user.getUsername();
    this.email = this.user.getEmail();
    this.icon = ["create", "create"];
    this.accountForm = this.formBuilder.group({
      username: [{ value: this.username, disabled: true }, Validators.required],
      email: [{ value: this.email, disabled: true }, Validators.required],
    });
  }

  ionViewWillEnter() {
  }

  public modify(element: string) {
    switch (element) {
      case 'username':
        if (this.accountForm.controls['username'].disabled) {
          this.icon[0] = "close-circle";
          this.accountForm.controls['username'].enable();
          break;
        } else {
          this.reset(element);
          break;
        }
      case 'email':
        if (this.accountForm.controls['email'].disabled) {
          this.icon[1] = "close-circle";
          this.accountForm.controls['email'].enable();
          break;
        } else {
          this.reset(element);
          break;
        }
      // case 'description':
      //   if (this.accountForm.controls['description'].disabled) {
      //     this.icon[3] = "close-circle";
      //     this.accountForm.controls['description'].enable();
      //     break;
      //   } else {
      //     this.reset(element);
      //     break;
      //   }
    }
  }

  public modifyAccount() {
    this.apihelper.modifyUser(this.accountForm.value, this.user.getToken())
      .subscribe(res => {
        this.apihelper.getCurrentUser(this.user.getToken()).subscribe(res => {
          this.user.setEmail(res.json().email);
          this.user.setUsername(res.json().username);
          this.username = this.user.getUsername();
          this.email = this.user.getEmail();
          this.reset("username");
          this.reset("email");
        });
      });
  }

  private reset(element: string) {
    switch (element) {
      case 'username':
        this.icon[0] = "create";
        this.accountForm.controls['username'].reset(this.username);
        break;
      case 'email':
        this.icon[1] = "create";
        this.accountForm.controls['email'].reset(this.email);
        break;
      // case 'description':
      // this.icon[3] = "create";
      // this.accountForm.controls['description'].reset(this.description);
    }
    this.accountForm.controls[element].disable();
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
