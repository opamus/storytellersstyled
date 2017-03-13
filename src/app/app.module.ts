import { WatcherPage } from './../pages/watcher/watcher';
import { RulesPage } from './../pages/rules/rules';
import { ContactsPage } from './../pages/contacts/contacts';
import { ArchiveState } from './../providers/archive-state';
import { ArchivePage } from './../pages/archive/archive';
import { UploadPage } from './../pages/upload/upload';
import { FrontState } from './../providers/front-state';
import { PlayerPage } from './../pages/player/player';
import { Thumbnails } from './../pipes/thumbnails';
import { Storage } from '@ionic/storage';
import { User } from './../providers/user';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { ApiHelper } from './../providers/api-helper';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Front } from '../pages/front/front';
import { AccountPage } from '../pages/account/account';

@NgModule({
  declarations: [
    MyApp,
    Front,
    AccountPage,
    AuthenticationPage,
    Thumbnails,
    PlayerPage,
    UploadPage,
    ArchivePage,
    ContactsPage,
    RulesPage,
    WatcherPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Front,
    AccountPage,
    AuthenticationPage,
    PlayerPage,
    UploadPage,
    ArchivePage,
    ContactsPage,
    RulesPage,
    WatcherPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ApiHelper, User, Storage, FrontState, ArchiveState]
})
export class AppModule {}
