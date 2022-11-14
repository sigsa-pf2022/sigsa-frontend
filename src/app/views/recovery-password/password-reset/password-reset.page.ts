import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RecoveryPasswordFormDataService } from 'src/app/services/recovery-password-form-data/recovery-password-form-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-password-reset',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/recovery-password/token-verification"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Recuperar Contraseña</ion-title>
        <ion-label class="ui-header__counter" slot="end">2 de 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rp">
      <ion-img class="rp__img" src="/assets/images/recovery-password/recovery.svg"></ion-img>
      <form *ngIf="this.form" class="rp__form" [formGroup]="this.form">
        <app-password-input placeholder="Nueva contraseña" controlName="password"> </app-password-input>
        <app-password-input placeholder="Repetir contraseña" controlName="repeatPassword"> </app-password-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.isFormValid()" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>`,
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnDestroy{
  form: FormGroup;
  constructor(
    private auth: AuthenticationService,
    private toastService: ToastService,
    private recoveryPasswordFormDataService: RecoveryPasswordFormDataService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.form = this.recoveryPasswordFormDataService.resetPasswordForm;
  }

  isFormValid() {
    return this.recoveryPasswordFormDataService.isResetPasswordFormValid;
  }

  onSubmit() {
    this.auth
      .resetPassword(this.form.value)
      .then(() => {
        this.router.navigateByUrl('/login');
        this.toastService.showSuccess('Contraseña reestablecida correctamente');
      })
      .catch(({ error }) => this.toastService.showError(error));
  }


  ngOnDestroy(){
    this.form.reset();
  }
}
