import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RecoveryPasswordFormDataService } from 'src/app/services/recovery-password-form-data/recovery-password-form-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-token-verification',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Recuperar Contraseña</ion-title>
        <ion-label class="ui-header__counter" slot="end">1 de 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="tv">
      <ion-img class="tv__img" src="/assets/images/recovery-password/token-verification.svg"></ion-img>
      <h4 class="tv__title">Ingrese el codigo recibido en su casilla de correo</h4>
      <form *ngIf="this.form" class="tv__form" [formGroup]="this.form">
        <ion-input class="ui-form-input" formControlName="code" type="number" placeholder="Código"> </ion-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form?.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>`,
  styleUrls: ['./token-verification.page.scss'],
})
export class TokenVerificationPage implements OnDestroy{
  form: FormGroup;
  constructor(
    private recoveryPasswordFormDataService: RecoveryPasswordFormDataService,
    private auth: AuthenticationService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this.form = this.recoveryPasswordFormDataService.tokenForm;
  }

  onSubmit() {
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
    this.form.reset();
  }
}
