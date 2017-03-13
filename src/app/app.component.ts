import { ContactsPage } from './../pages/contacts/contacts';
import { RulesPage } from './../pages/rules/rules';
import { ArchivePage } from './../pages/archive/archive';
import { AccountPage } from './../pages/account/account';
import { User } from './../providers/user';
import { ApiHelper } from './../providers/api-helper';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Front } from '../pages/front/front';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;
  private activePage;

  constructor(public platform: Platform, private storage: Storage, private apihelper: ApiHelper, private user: User) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Front Page', component: Front },
      { title: 'Account', component: AccountPage },
      { title: 'Archive', component: ArchivePage },
      { title: 'Rules', component: RulesPage },
      { title: 'Contacts', component: ContactsPage}
    ];
    this.activePage = this.pages[0];
    this.storage.get('token').then(token => {
      if (token) {
        this.apihelper.getCurrentUser(token).subscribe(res => {
          this.user.setToken(token);
          this.user.setEmail(res.json().email);
          this.user.setUser_id(res.json().user_id);
          this.user.setUsername(res.json().username);
          this.rootPage = Front;
        });
      } else {
        this.rootPage = AuthenticationPage;
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  checkPage(page) {
    return page == this.activePage;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
      this.activePage = page;
  }
}
