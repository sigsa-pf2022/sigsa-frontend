import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { SuccessCreationAcountComponent } from 'src/app/components/success-creation-acount/success-creation-acount.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';
import { RegisterFormDataService } from '../shared-register/services/register-form-data/register-form-data.service';

@Component({
  selector: 'app-user-data',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button
            [defaultHref]="this.isProfessional ? '/register/professional-data' : '/register/personal-data'"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Registrarse</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ud">
      <ion-img class="ud__img" src="/assets/images/register/user-data.svg"></ion-img>
      <form class="ud__form" [formGroup]="form" (submit)="onSubmit()">
        <ion-input class="ui-form-input" formControlName="email" placeholder="Email" type="text"></ion-input>
        <app-password-input placeholder="Contraseña" controlName="password"> </app-password-input>
        <app-password-input placeholder="Repetir contraseña" controlName="repeatPassword"> </app-password-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage {
  isProfessional: boolean;
  form = this.fb.group(
    {
      email: [null, [Validators.compose([Validators.required, Validators.email])]],
      password: [null, Validators.required],
      repeatPassword: [null, Validators.required],
    },
    {
      validators: [CustomValidators.passwordMatchValidator],
    }
  );
  constructor(
    private registerFormDataService: RegisterFormDataService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private navController: NavController,
    private auth: AuthenticationService,
    private professionalsService: ProfessionalsService
  ) {}

  ionViewWillEnter() {
    this.isProfessional = this.registerFormDataService.isProfessionalType();
  }
  async onSubmit() {
    this.registerFormDataService.setData(this.form.value);
    if (this.registerFormDataService.isProfessionalType()) {
      this.createProfessional();
    } else {
      this.createUser();
    }
  }

  async createUser() {
    await this.auth
      .signUp(this.registerFormDataService.getData())
      .then(() => this.successRegister())
      .catch((err) => {
        this.toastService.showError(err.message);
      });
  }
  async createProfessional() {
    await this.professionalsService
      .createProfessional(this.registerFormDataService.getData())
      .then(() => this.successRegister())
      .catch((err) => {
        this.toastService.showError(err.message);
      });
  }

  successRegister() {
    this.navController.navigateForward(['login']);
    this.registerFormDataService.cleanData();
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
