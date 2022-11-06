import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonDatetime, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { SuccessCreationAcountComponent } from 'src/app/components/success-creation-acount/success-creation-acount.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { RegisterFormDataService } from '../shared-register/services/register-form-data/register-form-data.service';

@Component({
  selector: 'app-user-data',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/register/personal-data"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Registrarse</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ud">
      <ion-img class="ud__img" src="/assets/images/register/user-data.svg"></ion-img>
      <form class="ud__form" [formGroup]="registerForm" (submit)="onSubmit()">
        <ion-input class="ui-form-input" formControlName="email" placeholder="Email" type="text"></ion-input>
        <app-password-input placeholder="Contraseña" controlName="password"> </app-password-input>
        <app-password-input placeholder="Repetir contraseña" controlName="repeatPassword"> </app-password-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.registerForm.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  registerForm: FormGroup;
  constructor(
    private registerFormDataService: RegisterFormDataService,
    private toastService: ToastService,
    private modalController: ModalController,
    private navController: NavController,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.registerForm = this.registerFormDataService.form;
    this.registerForm.patchValue({
      firstName: 'pedro',
      lastName: 'mar',
      gender: 'F',
      birthday: '11/01/1998',
      email: 'pedromar@gmail.com',
      password: '123456',
      repeatPassword: '123456',
    });
  }

  async onSubmit() {
    await this.auth
      .signUp(this.registerFormDataService.form.value)
      .then(() => this.successRegister())
      .catch((err) => {
        this.toastService.showError(err.message);
      });
  }

  successRegister() {
    this.navController.navigateForward(['login']);
    this.showSuccessModal();
  }

  async showSuccessModal() {
    const modal = await this.modalController.create({
      component: SuccessCreationAcountComponent,
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
