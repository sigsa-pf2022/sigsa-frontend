import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonDatetime, IonModal, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { GENDERS } from 'src/app/constants/Gender.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { RegisterFormDataService } from '../shared-register/services/register-form-data/register-form-data.service';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';

@Component({
  selector: 'app-personal-data',
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

          <div class="auth-stepper" aria-label="Paso 1">
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <div class="auth-stepper__bar"></div>
            <div class="auth-stepper__bar" *ngIf="this.userType === 'profesional'"></div>
            <span class="auth-stepper__count">1/{{ this.userType === 'profesional' ? 3 : 2 }}</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="auth">
      <div class="auth-container">
        <div class="auth-header">
          <p class="auth-header__eyebrow">Crear cuenta</p>
          <h1 class="auth-header__title">Tus datos personales</h1>
          <p class="auth-header__subtitle">
            Empezamos por lo básico. Después configurás tu acceso.
          </p>
        </div>

        <div class="pd__type-switch" role="tablist" aria-label="Tipo de cuenta">
          <button
            type="button"
            class="pd__type-option"
            [class.pd__type-option--active]="this.userType === 'usuario'"
            (click)="setUserType()"
            role="tab"
            [attr.aria-selected]="this.userType === 'usuario'"
          >
            <ion-icon name="person-outline"></ion-icon>
            Usuario
          </button>
          <button
            type="button"
            class="pd__type-option"
            [class.pd__type-option--active]="this.userType === 'profesional'"
            (click)="setProfessionalType()"
            role="tab"
            [attr.aria-selected]="this.userType === 'profesional'"
          >
            <ion-icon name="medkit-outline"></ion-icon>
            Profesional
          </button>
        </div>

        <form class="auth-form" [formGroup]="this.form">
          <div class="auth-field">
            <label class="auth-field__label" for="pd-firstname">Nombre</label>
            <div class="auth-input">
              <ion-input
                id="pd-firstname"
                formControlName="firstName"
                placeholder="Ej: Pedro"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
            <p class="auth-field__error" *ngIf="form.get('firstName')?.touched && form.get('firstName')?.invalid">
              Ingresá tu nombre.
            </p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="pd-lastname">Apellido</label>
            <div class="auth-input">
              <ion-input
                id="pd-lastname"
                formControlName="lastName"
                placeholder="Ej: Martínez"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
            <p class="auth-field__error" *ngIf="form.get('lastName')?.touched && form.get('lastName')?.invalid">
              Ingresá tu apellido.
            </p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="pd-dni">DNI</label>
            <div class="auth-input">
              <ion-input
                id="pd-dni"
                formControlName="dni"
                placeholder="Sin puntos ni espacios"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </div>
            <p class="auth-field__error" *ngIf="form.get('dni')?.touched && form.get('dni')?.invalid">
              <ng-container *ngIf="form.get('dni')?.hasError('pattern')">El DNI solo puede contener números.</ng-container>
              <ng-container *ngIf="!form.get('dni')?.hasError('pattern')">El DNI debe tener al menos 7 dígitos.</ng-container>
            </p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="pd-gender">Género</label>
            <div class="auth-input">
              <ion-select
                id="pd-gender"
                okText="Confirmar"
                cancelText="Cancelar"
                formControlName="gender"
                placeholder="Seleccioná una opción"
                interface="alert"
              >
                <ion-select-option *ngFor="let gender of this.genders" [value]="gender.value">{{
                  gender.text
                }}</ion-select-option>
              </ion-select>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label">Fecha de nacimiento</label>
            <button
              type="button"
              class="date-field"
              [class.date-field--empty]="!form.value.birthday"
              (click)="openDateModal($event)"
            >
              <span>{{ form.value.birthday || 'DD/MM/AAAA' }}</span>
              <ion-icon name="calendar-outline"></ion-icon>
            </button>
            <ion-modal #dateModal class="calendar-modal">
              <ng-template>
                <ion-content>
                  <ion-datetime
                    #bdt
                    [value]="this.maxDate"
                    [max]="this.maxDate"
                    locale="es-ES"
                    presentation="date"
                    (ionChange)="dateChanged(bdt.value)"
                    [showDefaultButtons]="false"
                  >
                    <ion-buttons slot="buttons">
                      <ion-button class="datetime-done" (click)="confirmDateSelection()">Listo</ion-button>
                    </ion-buttons>
                  </ion-datetime>
                </ion-content>
              </ng-template>
            </ion-modal>
          </div>
        </form>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="navigate()"
        [disabled]="!this.form.valid"
      >
        Siguiente
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('dateModal') dateModal: IonModal;
  form = this.fb.group({
    firstName: [null, [Validators.compose([Validators.required, Validators.maxLength(50)])]],
    lastName: [null, [Validators.compose([Validators.required, Validators.maxLength(50)])]],
    gender: [null, Validators.required],
    birthday: [null, Validators.required],
    dni: [null, [Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(7)])]],
  });
  userType: 'profesional' | 'usuario' = 'usuario';
  url = '/register/user-data';
  showCalendar = false;
  maxDate = format(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDay()), 'yyyy-MM-dd');
  // timeout;
  // el;
  genders = GENDERS;

  constructor(
    private dateFormatterService: DateFormatterService,
    private navController: NavController,
    private fb: FormBuilder,
    private registerFormDataService: RegisterFormDataService, // private gestureCtrl: GestureController
    private professionalsService: ProfessionalsService
  ) {}

  ionViewWillEnter() {}

  async onSubmit() {
    this.registerFormDataService.setData(this.form.value);
    this.getUserByDNI()
  }

  getUserByDNI() {
    throw new Error('Method not implemented.');
  }

  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  dateChanged(date: string | string[]) {
    const dateStr = Array.isArray(date) ? date[0] : date;
    this.form
      .get('birthday')
      .setValue(
        format(
          parseISO(format(this.dateFormatterService.createDateFromCalendarStringDate(dateStr), 'yyyy-MM-dd')),
          'dd/MM/yyyy'
        )
      );
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }

  async openDateModal(event: Event) {
    (event?.target as HTMLElement)?.blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    await this.dateModal?.present();
  }

  goBack() {
    this.navController.navigateBack(['/welcome']);
  }

  navigate() {
    this.registerFormDataService.setData(this.form.value);
    return this.navController.navigateForward([this.url]);
  }

  changeUserType() {
    return this.userType === 'profesional' ? this.setUserType() : this.setProfessionalType();
  }

  setUserType() {
    this.userType = 'usuario';
    this.url = '/register/user-data';
    this.registerFormDataService.setUserType('usuario');
  }

  setProfessionalType() {
    this.userType = 'profesional';
    this.url = '/register/professional-data';
    this.registerFormDataService.setUserType('profesional');
  }
}
