import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RecoveryPasswordFormDataService } from 'src/app/services/recovery-password-form-data/recovery-password-form-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-password-reset',
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
          <div class="auth-stepper" aria-label="Paso 2 de 2">
            <div class="auth-stepper__bar auth-stepper__bar--done"></div>
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <span class="auth-stepper__count">2/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="auth">
      <div class="auth-container">
        <div class="auth-hero" aria-hidden="true">
          <ion-icon name="lock-closed" class="rp__hero-icon"></ion-icon>
        </div>

        <div class="auth-header">
          <p class="auth-header__eyebrow">Recuperar contraseña</p>
          <h1 class="auth-header__title">Nueva contraseña</h1>
          <p class="auth-header__subtitle">
            Creá una contraseña segura para volver a entrar a tu cuenta.
          </p>
        </div>

        <form *ngIf="this.form" class="auth-form" [formGroup]="this.form" (submit)="onSubmit()">
          <div class="auth-field">
            <label class="auth-field__label">Nueva contraseña</label>
            <app-password-input placeholder="Mínimo 6 caracteres" controlName="password"></app-password-input>
            <p class="auth-field__hint">Usá al menos 6 caracteres.</p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label">Repetir contraseña</label>
            <app-password-input placeholder="Volvé a escribirla" controlName="repeatPassword"></app-password-input>
          </div>
          <button type="submit" hidden></button>
        </form>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
        [disabled]="!this.isFormValid()"
      >
        Guardar contraseña
      </button>
    </ion-footer>
  `,
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnDestroy{
  form: FormGroup;
  constructor(
    private auth: AuthenticationService,
    private toastService: ToastService,
    private recoveryPasswordFormDataService: RecoveryPasswordFormDataService,
    private router: Router,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.form = this.recoveryPasswordFormDataService.resetPasswordForm;
  }

  goBack() {
    this.navController.navigateBack(['/recovery-password/token-verification']);
  }

  isFormValid() {
    return this.recoveryPasswordFormDataService.isResetPasswordFormValid;
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    this.auth
      .resetPassword(this.form.value)
      .then(() => {
        this.router.navigateByUrl('/login');
        this.toastService.showSuccess('Contraseña restablecida correctamente');
      })
      .catch(({ error }) => this.toastService.showError(error));
  }


  ngOnDestroy(){
    this.form?.reset();
  }
}
