import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PROFILE_OPTIONS } from './constants/profile-options';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Mi Perfil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="p__items">
        <app-profile-item
          *ngFor="let option of options"
          [title]="option.title"
          [icon]="option.icon"
          [profileIcon]="option.profileIcon"
          [content]="option.content"
        >
        </app-profile-item>
      </div>
    </ion-content>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  options = PROFILE_OPTIONS;
  constructor(private auth: AuthenticationService) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.setUserEmail();
  }
  setUserEmail() {
    this.options[0].title = `${this.auth.user().firstName}#${this.auth.user().username}`;
  }
}
