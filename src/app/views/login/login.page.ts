import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { RecoveryPasswordModalComponent } from 'src/app/components/recovery-password-modal/recovery-password-modal.component';
import { SendVerificationEmailModalComponent } from 'src/app/components/send-verification-email-modal/send-verification-email-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RecoveryPasswordFormDataService } from 'src/app/services/recovery-password-form-data/recovery-password-form-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserValidationModalComponent } from './shared-login/components/user-validation-modal/user-validation-modal.component';

@Component({
  selector: 'app-login',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goBack()"
            aria-label="Volver"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="auth">
      <div class="auth-container">
        <div class="auth-hero" aria-hidden="true">
          <ion-icon name="lock-closed" class="login__hero-icon"></ion-icon>
        </div>

        <div class="auth-header">
          <p class="auth-header__eyebrow">SIGSA</p>
          <h1 class="auth-header__title">Bienvenido</h1>
          <p class="auth-header__subtitle">
            Iniciá sesión para gestionar tu salud y la de tu familia.
          </p>
        </div>

        <form class="auth-form" [formGroup]="this.loginForm" (submit)="login()">
          <div class="auth-field">
            <label class="auth-field__label" for="login-email">Email</label>
            <div class="auth-input">
              <ion-input
                id="login-email"
                formControlName="email"
                placeholder="tu@email.com"
                type="email"
                autocomplete="email"
                inputmode="email"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="login-password">Contraseña</label>
            <app-password-input controlName="password" placeholder="Ingresá tu contraseña"></app-password-input>
          </div>

          <button
            type="button"
            class="auth-btn auth-btn--ghost login__forgot"
            (click)="openRecoveryPassword()"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button type="submit" hidden></button>
        </form>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="login()"
        [disabled]="!this.loginForm.valid"
      >
        Ingresar
      </button>

      <div class="auth-footer__inline">
        <span>¿No tenés una cuenta?</span>
        <button type="button" (click)="goToRegister()">Registrate</button>
      </div>
    </ion-footer>
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
    private router: Router,
    private recoveryPasswordFormDataService: RecoveryPasswordFormDataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  goBack() {
    this.navController.navigateBack(['/welcome']);
  }

  async login() {
    if (!this.loginForm.valid) return;
    await this.auth
      .userStatus(this.loginForm.value.email)
      .then(async (isValidatedUser) => {
        if (isValidatedUser) {
          await this.signIn();
        } else {
          this.openValidationUserModal();
        }
      })
      .catch(({ error }) => this.toastService.showError(error.message));
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
    const { data } = await modal.onWillDismiss();
    if (data?.email) {
      await this.auth.sendPasswordResetEmail(data.email).then(() => {
        this.recoveryPasswordFormDataService.tokenForm.patchValue({ email: data.email });
        this.router.navigateByUrl('/recovery-password/token-verification');
      });
    }
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
