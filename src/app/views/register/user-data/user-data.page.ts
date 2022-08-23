import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonDatetime, NavController } from '@ionic/angular';
import { format } from 'date-fns';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegisterFormDataService } from '../services/register-form-data.service';

@Component({
  selector: 'app-user-data',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/register/personal-data"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ud">
      <ion-img
        class="ud__img"
        src="/assets/images/register/user-data.svg"
      ></ion-img>
      <form class="ud__form" [formGroup]="registerForm" (submit)="onSubmit()">
        <ion-input
          class="ui-form-input"
          formControlName="email"
          placeholder="Email"
          type="text"
        ></ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="password"
          placeholder="Contraseña"
          type="password"
        ></ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="repeatPassword"
          placeholder="Repetir Contraseña"
          type="password"
        ></ion-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button
        (click)="onSubmit()"
        [disabled]="!this.registerForm.valid"
        color="primary"
      >
        Siguiente
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  registerForm: FormGroup;
  showCalendar = false;
  date = format(new Date(), 'yyyy-MM-dd');
  formattedDate;
  constructor(
    private registerFormDataService: RegisterFormDataService,
    private navController: NavController,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.registerForm = this.registerFormDataService.form;
  }

  async onSubmit() {
    await this.authService
      .signUp(
        this.registerForm.get('email').value,
        this.registerForm.get('password').value
      )
      .then((res) => {
        this.navController.navigateRoot(['/login']);
      });
  }

  navigate() {
    this.navController.navigateForward(['/user-data']);
  }
}
