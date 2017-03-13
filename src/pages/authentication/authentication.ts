import { Front } from './../front/front';
import { User } from './../../providers/user';
import { PasswordRetypeValidator } from './../../validators/password-retype-validator';
import { ApiHelper } from './../../providers/api-helper';
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsernameValidator } from '../../validators/username-validator';
import { Form } from '../../data-model/form';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html'
})
export class AuthenticationPage {

  private loginForm: FormGroup;
  private signupForm: FormGroup;
  private formTongle: boolean;
  private formType: string;
  private formData: Form;

  constructor(public navCtrl: NavController, private formbuilder: FormBuilder,
    private apihelper: ApiHelper, private zone: NgZone, private storage: Storage, private user: User) {
    this.formTongle = true;
    this.formType = "Signup";
    this.buildLoginForm();
    this.buildSignupForm();

  }

  public login() {
    this.apihelper.login(this.extractData("login")).subscribe(res => {
      this.saveAndDismiss(res);
    });
  }

  public signup() {
    this.apihelper.signup(this.extractData("signup")).subscribe(res => {
      this.apihelper.login(this.extractData("loginAfterSignup")).subscribe(res => {
        this.apihelper.uploadFile()
        this.saveAndDismiss(res);
      });
    });
  }

  public switchForm() {
    this.formTongle = !this.formTongle;
    if (this.formTongle) {
      this.formType = "Signup";
    } else {
      this.formType = "Login";
    }
  }

  private saveAndDismiss(res: any) {
    this.user.setToken(res.json().token);
    this.user.setEmail(res.json().user.email);
    this.user.setUser_id(res.json().user.user_id);
    this.user.setUsername(res.json().user.username);
    this.storage.set('token', res.json().token).then(res => {
      this.navCtrl.setRoot(Front);
    });
  }

  private extractData(formType: string): {} {
    switch (formType) {
      case "login":
        this.formData = new Form(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);
        return this.formData.getData();
      case "signup":
        if (this.signupForm.controls['fullname'].value) {
          this.formData = new Form(this.signupForm.controls['username'].value, this.signupForm.controls['password'].value,
            this.signupForm.controls['email'].value, this.signupForm.controls['fullname'].value);
        } else {
          this.formData = new Form(this.signupForm.controls['username'].value, this.signupForm.controls['password'].value,
            this.signupForm.controls['email'].value);
        }
        return this.formData.getData();
      case "loginAfterSignup":
        this.formData = new Form(this.signupForm.controls['username'].value, this.signupForm.controls['password'].value);
        return this.formData.getData();
    }
  }

  private buildSignupForm() {
    this.loginForm = this.formbuilder.group({
      username: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
    });
  }

  private buildLoginForm() {
    this.signupForm = this.formbuilder.group({
      username: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required]), new UsernameValidator(this.apihelper).checkUsername],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      retype: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      fullname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])]
    }, { validator: PasswordRetypeValidator.validate });
  }

}
