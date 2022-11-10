import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonDatetime, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { Gesture, GestureController } from '@ionic/angular';
import { RegisterFormDataService } from '../shared-register/services/register-form-data/register-form-data.service';

@Component({
  selector: 'app-personal-data',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/welcome"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Registrarse</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="pd">
      <ion-img class="pd__img" src="/assets/images/register/personal-data.svg"></ion-img>
      <div class="pd__notice">
        <ion-text class=" ui-font-profile-text">Atencion: Usted se esta registrando como</ion-text
        ><ion-text class="pd__notice__type">{{ this.userType | uppercase }}</ion-text>
      </div>

      <form class="pd__form" [formGroup]="registerForm">
        <ion-input class="ui-form-input" formControlName="firstName" placeholder="Nombre" type="text"></ion-input>
        <ion-input class="ui-form-input" formControlName="lastName" placeholder="Apellido" type="text"></ion-input>
        <ion-input class="ui-form-input" formControlName="dni" placeholder="DNI" type="text"></ion-input>
        <ion-select class="ui-form-input" formControlName="gender" placeholder="Genero" interface="alert">
          <ion-select-option value="M">Masculino</ion-select-option>
          <ion-select-option value="F">Femenino</ion-select-option>
          <ion-select-option value="PNF">Prefiero no decirlo</ion-select-option>
        </ion-select>
        <ion-input
          class="ui-form-input"
          [disabled]="true"
          placeholder="Fecha de Nacimiento"
          formControlName="birthday"
          id="open-modal"
        >
        </ion-input>
        <ion-modal trigger="open-modal" class="calendar-modal">
          <ng-template>
            <ion-content>
              <ion-datetime
                #bdt
                [value]="this.maxDate"
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
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button class="ui-button-outlined" expand="block" (click)="changeUserType()"
        >Registrese como {{ this.userType === 'usuario' ? 'profesional' : 'usuario' }}</ion-button
      >
      <ion-button (click)="navigate()" expand="block" [disabled]="!this.formValid()" color="primary">
        Siguiente
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  registerForm: FormGroup;
  userType: 'profesional' | 'usuario' = 'usuario';
  url = '/register/user-data';
  showCalendar = false;
  maxDate = format(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDay()), 'yyyy-MM-dd');
  // timeout;
  // el;

  constructor(
    private dateFormatterService: DateFormatterService,
    private navController: NavController,
    private registerFormDataService: RegisterFormDataService // private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    this.registerForm = this.registerFormDataService.form;
  }

  ionViewWillEnter() {
    //   this.el = document.getElementById('register');
    //   const gesture: Gesture = this.gestureCtrl.create({
    //     el: this.el,
    //     gestureName: 'asd',
    //     threshold: 0,
    //     onStart: () => {
    //       this.onStart();
    //     },
    //     onMove: (detail) => {
    //       this.onMove(detail);
    //     },
    //     onEnd: () => {
    //       this.clearGestureTimeout();
    //     },
    //   });
    //   gesture.enable(true);
  }

  // onStart() {
  //   const TIMEOUT = 500;
  //   this.clearGestureTimeout();

  //   this.timeout = setTimeout(() => {
  //     console.log('longPress');
  //     this.timeout = undefined;
  //   }, TIMEOUT);
  // }

  // onMove(detail) {
  //   // Allow a little bit of movement
  //   if (detail.deltaX <= 10 && detail.deltaY <= 10) {
  //     return;
  //   }

  //   this.clearGestureTimeout();
  // }

  // clearGestureTimeout() {
  //   if (this.timeout) {
  //     clearTimeout(this.timeout);
  //     this.timeout = undefined;
  //   }
  // }

  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  // itemPressed() {
  //   console.log('itemPressed');
  // }

  dateChanged(date: string) {
    this.registerForm
      .get('birthday')
      .setValue(
        format(
          parseISO(format(this.dateFormatterService.createDateFromCalendarStringDate(date), 'yyyy-MM-dd')),
          'dd/MM/yyyy'
        )
      );
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }

  formValid() {
    return this.registerFormDataService.personalDataValid();
  }

  navigate() {
    return this.navController.navigateForward([this.url]);
  }

  changeUserType() {
    return this.userType === 'profesional' ? this.setUserType() : this.setProfessionalType();
  }

  setUserType() {
    this.userType = 'usuario';
    this.url = '/register/user-data';
  }

  setProfessionalType() {
    this.userType = 'profesional';
    this.url = '/register/professional-data';
  }
}
