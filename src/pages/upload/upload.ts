import { User } from './../../providers/user';
import { ApiHelper } from './../../providers/api-helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController } from 'ionic-angular';
import { Camera, FilePath, Transfer, FileUploadResult } from 'ionic-native';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {
  private uploadForm: FormGroup;
  private isImgChosen: boolean;
  private picture: any;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder,
    private apihelper: ApiHelper, private user: User, private toastCtrl: ToastController, private actionsheetCtrl: ActionSheetController) {
    this.uploadForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.maxLength(250)],
    });
    this.isImgChosen = true;
  }

  public choosePicture(event) {
    let actionsheet = this.actionsheetCtrl.create({
      title: 'Choose picture from',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.getImgFromGallery();
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.getImgFromCamera();
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel'
        }
      ]
    });
    actionsheet.present();
  }

  private getImgFromGallery() {
    console.log('gallery');
    let options = {
      quality: 100,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      destinationType: Camera.DestinationType.NATIVE_URI
    };
    Camera.getPicture(options).then(img => {
      FilePath.resolveNativePath(img).then(img => {
        this.picture = img;
        this.isImgChosen = false;
        return true;
      });
    });
  }

  private getImgFromCamera() {
    console.log('camera');
    let options = {
      quality: 100,
      sourceType: Camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      destinationType: Camera.DestinationType.NATIVE_URI
    };
    Camera.getPicture(options).then(img => {
      FilePath.resolveNativePath(img).then(img => {
        this.picture = img;
        this.isImgChosen = false;
        return true;
      });
    });
  }

  public upload() {
    if (!this.isImgChosen) {
      this.uploadData();
      let toast = this.toastCtrl.create({
        message: 'File added, please refresh to view',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      let toast = this.toastCtrl.create({
        message: 'Please choose file',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }


  private uploadData() {
    const fileTransfer = new Transfer();
    let url = 'http://media.mw.metropolia.fi/wbma/media/';
    let options;
    if (this.uploadForm.controls['description'].value) {
      options = {
        params: { title: this.uploadForm.controls['title'].value, description: this.uploadForm.controls['description'].value },
        headers: { 'x-access-token': this.user.getToken() }
      }
    } else {
      options = {
        params: { title: this.uploadForm.controls['title'].value },
        headers: { 'x-access-token': this.user.getToken() }
      }
    }
    fileTransfer.upload(this.picture, url, options).then( (res: FileUploadResult) => {
      let result = JSON.parse(res.response);
      let data = {
        file_id: result.file_id,
        tag: "Storytime"
      }
      this.apihelper.tag(data, this.user.getToken())
        .subscribe(res => {
          this.navCtrl.pop();
        });
    });
  }
}
