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

          <div class="auth-stepper" [attr.aria-label]="isProfessional ? 'Paso 3 de 3' : 'Paso 2 de 2'">
            <div class="auth-stepper__bar auth-stepper__bar--done"></div>
            <div class="auth-stepper__bar auth-stepper__bar--done" *ngIf="isProfessional"></div>
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <span class="auth-stepper__count">{{ isProfessional ? '3/3' : '2/2' }}</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="auth">
      <div class="auth-container">
        <div class="auth-hero" aria-hidden="true">
          <ion-icon name="shield-checkmark" class="ud__hero-icon"></ion-icon>
        </div>

        <div class="auth-header">
          <p class="auth-header__eyebrow">Último paso</p>
          <h1 class="auth-header__title">Tu acceso</h1>
          <p class="auth-header__subtitle">
            Vas a usar este email y contraseña para entrar a SIGSA.
          </p>
        </div>

        <form class="auth-form" [formGroup]="form" (submit)="onSubmit()">
          <div class="auth-field">
            <label class="auth-field__label" for="ud-email">Email</label>
            <div class="auth-input">
              <ion-input
                id="ud-email"
                formControlName="email"
                placeholder="tu@email.com"
                type="email"
                inputmode="email"
                autocomplete="email"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label">Contraseña</label>
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
        [disabled]="!this.form.valid"
      >
        Crear cuenta
      </button>
    </ion-footer>
  `,
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage {
  isProfessional: boolean;
  form = this.fb.group(
    {
      email: [null, [Validators.compose([Validators.required, Validators.email])]],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      repeatPassword: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
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

  goBack() {
    this.navController.navigateBack([
      this.isProfessional ? '/register/professional-data' : '/register/personal-data',
    ]);
  }

  async onSubmit() {
    if (!this.form.valid) return;
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
      .catch(({error}) => {
        this.toastService.showError(error.message);
      });
  }
  async createProfessional() {
    await this.professionalsService
      .createProfessional(this.registerFormDataService.getData())
      .then(() => this.successRegister())
      .catch(({ error }) => {
        this.toastService.showError(error.message);
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
