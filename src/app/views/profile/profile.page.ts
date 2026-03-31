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
        <div class="p__items__logout" (click)="logout()">
          <ion-icon color="danger" name="log-out-outline"></ion-icon>
          <ion-text>Salir</ion-text>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  options = [];
  constructor(private auth: AuthenticationService, private navController: NavController) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.buildOptions();
  }
  logout() {
    this.auth.signOut();
    return this.navController.navigateRoot(['welcome']);
  }
  buildOptions() {
    const user = this.auth.user();
    this.options = JSON.parse(JSON.stringify(PROFILE_OPTIONS));
    this.options[0].title = user.firstName;

    if (user.role === 'professional') {
      // Replace "Mis Profesionales" (index 1) with "Mis Pacientes"
      this.options[1] = {
        icon: 'people-outline',
        title: 'Mis Pacientes',
        action: {
          type: 'navigate',
          payload: '/patients',
        },
      };
    }
  }

  doAction(event) {
    if (event.type === 'navigate') {
      this.navController.navigateForward([event.payload]);
    }
  }
}
