import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SendVerificationEmailModalComponent } from 'src/app/components/send-verification-email-modal/send-verification-email-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

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
        <ion-img
          class="ui-logo__small"
          src="/assets/images/logos/logo-with-title.png"
        ></ion-img>
      </div>
      <div class="login__content ui-background__light">
        <form
          class="login__content__form"
          [formGroup]="this.loginForm"
          (submit)="onSubmit()"
        >
          <ion-text
            class="login__content__form__title ui-font-title"
            color="complementary"
            >Bienvenido</ion-text
          >
          <div class="login__content__form__items">
            <ion-input
              class="ui-form-input"
              formControlName="email"
              placeholder="Email"
            ></ion-input>
            <ion-input
              class="ui-form-input"
              formControlName="password"
              placeholder="Contraseña"
              type="password"
            ></ion-input>
            <ion-text
              class="login__content__form__items__forgot-password ui-font-text"
              color="complementary"
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
              <ion-text class="ui-font-text" color="medium"
                >No tiene una cuenta?</ion-text
              >
              <ion-text
                (click)="goToRegister()"
                class="ui-font-text"
                color="complementary"
              >
                Registrese</ion-text
              >
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
    email: [
      null,
      [Validators.compose([Validators.email, Validators.required])],
    ],
    password: [
      null,
      [Validators.compose([Validators.minLength(6), Validators.required])],
    ],
  });
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private auth: AuthenticationService,
    private modalController: ModalController,
    private toast: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async onSubmit() {
    await this.auth
      .signIn(this.loginForm.value)
      .then(async (user) => {
        if (!user.emailVerified) {
          this.sendVerificationEmailModal();
        }
      })
      .catch((error) => {
        this.showError(error);
      });
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
      await this.auth.sendVerificationMail();
    }
    await this.auth.signOut();
  }

  goToRegister() {
    this.navController.navigateForward(['/register/personal-data']);
  }

  async showError(code: string) {
    const toast = await this.toast.create({
      message: this.translate.instant(`login.errors.${code}`),
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
}
