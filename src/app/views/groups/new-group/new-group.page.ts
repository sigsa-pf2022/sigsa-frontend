import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonDatetime, ModalController, NavController, ToastController } from '@ionic/angular';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { format, parseISO } from 'date-fns';
import { SuccessCreationAcountComponent } from 'src/app/components/success-creation-acount/success-creation-acount.component';
import { NewGroupDataService } from '../shared/services/new-group-data/new-group-data.service';
import { BLOODTYPES } from 'src/app/constants/Bloodtypes.constant';

@Component({
  selector: 'app-new-group',
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

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Nuevo grupo</p>
        <h1 class="listing-header__title">Datos del grupo</h1>
      </header>

      <form class="auth-form ng__form" [formGroup]="form">
        <div class="ng__section">
          <p class="ng__section-title">Grupo</p>

          <div class="auth-field">
            <label class="auth-field__label" for="ng-name">Nombre del grupo</label>
            <div class="auth-input">
              <ion-input
                id="ng-name"
                formControlName="name"
                placeholder="Ej: Familia Pérez"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
          </div>
        </div>

        <div class="ng__section">
          <p class="ng__section-title">Dependiente</p>

          <div class="auth-field">
            <label class="auth-field__label" for="ng-firstname">Nombre</label>
            <div class="auth-input">
              <ion-input
                id="ng-firstname"
                formControlName="firstName"
                placeholder="Nombre"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="ng-lastname">Apellido</label>
            <div class="auth-input">
              <ion-input
                id="ng-lastname"
                formControlName="lastName"
                placeholder="Apellido"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="ng-dni">DNI</label>
            <div class="auth-input">
              <ion-input
                id="ng-dni"
                formControlName="dni"
                placeholder="Sin puntos ni espacios"
                type="number"
                inputmode="numeric"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="ng-blood">Grupo sanguíneo</label>
            <div class="auth-input">
              <ion-select
                id="ng-blood"
                okText="Confirmar"
                cancelText="Cancelar"
                formControlName="bloodType"
                placeholder="Seleccioná uno"
                interface="alert"
              >
                <ion-select-option *ngFor="let bloodtype of bloodtypes" [value]="bloodtype.value">{{
                  bloodtype.text
                }}</ion-select-option>
              </ion-select>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="open-modal">Fecha de nacimiento</label>
            <button
              type="button"
              class="date-field"
              [class.date-field--empty]="!form.value.birthday"
              id="open-modal"
            >
              <span>{{ form.value.birthday || 'DD/MM/AAAA' }}</span>
              <ion-icon name="calendar-outline"></ion-icon>
            </button>
          </div>

          <ion-modal trigger="open-modal" class="calendar-modal">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #bdt
                  [value]="date"
                  [max]="this.maxDate"
                  locale="es-ES"
                  presentation="date"
                  (ionChange)="dateChanged(bdt.value)"
                >
                  <ion-buttons slot="buttons">
                    <ion-button color="primary" (click)="confirmDateSelection()">Confirmar</ion-button>
                  </ion-buttons>
                </ion-datetime>
              </ion-content>
            </ng-template>
          </ion-modal>
        </div>
      </form>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
        [disabled]="!isFormValid()"
      >
        Siguiente
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  showCalendar = false;
  date = format(new Date(), 'yyyy-MM-dd');
  maxDate = format(new Date(), 'yyyy-MM-dd');
  bloodtypes = BLOODTYPES;
  form = this.fb.group({
    name: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dni: ['', Validators.required],
    bloodType: ['', Validators.required],
    birthday: ['', Validators.required],
  });
  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private navController: NavController,
    private newGroupDataService: NewGroupDataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  goBack() {
    this.navController.navigateBack(['/tabs/home']);
  }

  isFormValid() {
    return this.form.valid;
  }
  async onSubmit() {
    this.saveData();
    this.navController.navigateForward(['/groups/add-members']);
  }

  saveData() {
    this.newGroupDataService.update(this.form.value);
  }
  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  async successRegister() {
    const modal = await this.modalController.create({
      component: SuccessCreationAcountComponent,
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
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
}
