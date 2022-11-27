import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
          [action]="option.action"
          (doAction)="this.doAction($event)"
        >
        </app-profile-item>
      </div>
    </ion-content>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  options = PROFILE_OPTIONS;
  constructor(
    private auth: AuthenticationService,
    private navController: NavController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.setUserEmail();
  }
  setUserEmail() {
    this.options[0].title = `${this.auth.user().firstName}`;
  }

  doAction(event) {
    if (event.type === 'navigate') {
      this.navController.navigateForward([event.payload]);
    }
  }
}
