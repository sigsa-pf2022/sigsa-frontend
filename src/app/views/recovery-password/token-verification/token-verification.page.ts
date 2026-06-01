import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RecoveryPasswordFormDataService } from 'src/app/services/recovery-password-form-data/recovery-password-form-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-token-verification',
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
          <div class="auth-stepper" aria-label="Paso 1 de 2">
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <div class="auth-stepper__bar"></div>
            <span class="auth-stepper__count">1/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="auth">
      <div class="auth-container">
        <div class="auth-hero" aria-hidden="true">
          <ion-icon name="mail" class="tv__hero-icon"></ion-icon>
        </div>

        <div class="auth-header">
          <p class="auth-header__eyebrow">Recuperar contraseña</p>
          <h1 class="auth-header__title">Ingresá el código</h1>
          <p class="auth-header__subtitle">
            Te enviamos un código de 6 dígitos a tu correo. Revisá la bandeja de entrada y spam.
          </p>
        </div>

        <form *ngIf="this.form" class="auth-form" [formGroup]="this.form" (submit)="onSubmit()">
          <div class="auth-field">
            <label class="auth-field__label" for="tv-code">Código</label>
            <div class="auth-input">
              <ion-input
                id="tv-code"
                class="code-input"
                formControlName="code"
                type="number"
                inputmode="numeric"
                placeholder="000000"
                maxlength="6"
              ></ion-input>
            </div>
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
        [disabled]="!this.form?.valid"
      >
        Verificar
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./token-verification.page.scss'],
})
export class TokenVerificationPage implements OnDestroy{
  form: FormGroup;
  constructor(
    private recoveryPasswordFormDataService: RecoveryPasswordFormDataService,
    private auth: AuthenticationService,
    private router: Router,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this.form = this.recoveryPasswordFormDataService.tokenForm;
  }

  goBack() {
    this.navController.navigateBack(['/login']);
  }

  onSubmit() {
    if (!this.form?.valid) return;
    this.auth
      .validateCode(this.form.value)
      .then(() => {
        this.recoveryPasswordFormDataService.resetPasswordForm.patchValue({ email: this.form.get('email').value });
        this.router.navigateByUrl('/recovery-password/password-reset');
      })
      .catch(({ error }) => {
        this.toastService.showError(error);
      });
  }

  ngOnDestroy(){
    this.form?.reset();
  }
}
