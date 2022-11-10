import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { RecoveryPasswordModalComponent } from 'src/app/components/recovery-password-modal/recovery-password-modal.component';
import { SendVerificationEmailModalComponent } from 'src/app/components/send-verification-email-modal/send-verification-email-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PlatformService } from 'src/app/services/platform/platform.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserValidationModalComponent } from './shared-login/components/user-validation-modal/user-validation-modal.component';

@Component({
  selector: 'app-login',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__transparent">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="login">
      <div class="login__logo ui-background__light">
        <ion-img class="ui-logo__small" src="/assets/images/logos/logo-with-title.png"></ion-img>
      </div>
      <div class="login__content ui-background__light">
        <form class="login__content__form" [formGroup]="this.loginForm" (submit)="login()">
          <ion-text class="login__content__form__title ui-font-title" color="complementary">Bienvenido</ion-text>
          <div class="login__content__form__items">
            <ion-input class="ui-form-input" formControlName="email" placeholder="Email"></ion-input>
            <app-password-input controlName="password" placeholder="Contraseña"> </app-password-input>
            <ion-text
              class="login__content__form__items__forgot-password ui-font-text"
              color="complementary"
              (click)="openRecoveryPassword()"
              >¿Olvido su contraseña?</ion-text
            >
          </div>
          <div class="login__content__form__actions">
            <ion-button
              class="ui-button"
              type="submit"
              color="primary"
              expand="block"
              [disabled]="!this.loginForm.valid"
            >
              Ingresar
            </ion-button>
            <div class="login__content__form__actions__secondary">
              <ion-text class="ui-font-text" color="medium">No tiene una cuenta?</ion-text>
              <ion-text (click)="goToRegister()" class="ui-font-text" color="complementary"> Registrese</ion-text>
            </div>
          </div>
        </form>
      </div>
    </ion-content>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = this.fb.group({
    email: [null, [Validators.compose([Validators.email, Validators.required])]],
    password: [null, [Validators.compose([Validators.minLength(6), Validators.required])]],
  });
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private auth: AuthenticationService,
    private modalController: ModalController,
    private toastService: ToastService,
    public platformService: PlatformService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  async login() {
    const isValidatedUser = await this.auth.userStatus(this.loginForm.get('email').value);
    if (isValidatedUser) {
      await this.signIn();
    } else {
      this.openValidationUserModal();
    }
  }

  async signIn() {
    await this.auth
      .signIn(this.loginForm.value)
      .then(() => this.goHome())
      .catch(({ error }) => this.showError(error.message));
  }

  goHome() {
    this.navController.navigateRoot(['tabs/home']);
  }

  async sendVerificationEmailModal() {
    const modal = await this.modalController.create({
      component: SendVerificationEmailModalComponent,
      cssClass: 'modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'resend') {
      // await this.auth.sendVerificationMail();
    }
    // await this.auth.signOut();
  }

  async openRecoveryPassword() {
    const modal = await this.modalController.create({
      component: RecoveryPasswordModalComponent,
      cssClass: 'modal',
    });
    await modal.present();
  }

  async openValidationUserModal() {
    const modal = await this.modalController.create({
      component: UserValidationModalComponent,
      cssClass: 'modal',
      canDismiss: true,
      backdropDismiss: true,
      componentProps: { email: this.loginForm.get('email').value },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.status === 'invalid-code') {
      this.showError(data.message);
    } else {
      await this.signIn();
    }
  }

  goToRegister() {
    this.navController.navigateForward(['/register/personal-data']);
  }

  showError(code: string) {
    this.toastService.showError(code);
  }
}
