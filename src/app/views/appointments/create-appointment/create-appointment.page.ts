import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { IonDatetime, NavController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { LocalNotificationsService } from 'src/app/services/local-notifications/local-notifications.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { AppointmentDataService } from '../shared/services/appointment-data/appointment-data.service';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';

@Component({
  selector: 'app-create-appointment',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/appointments/pick-doctor"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Crear Turno</ion-title>
        <ion-label class="ui-header__counter" slot="end">2 de 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ca">
      <div class="ca__doctor">
        <div class="ca__doctor__background">
          <ion-item lines="none" class="ca__doctor__item no-padding">
            <div class="ca__doctor__item__wrapper">
              <ion-img [src]="'assets/images/reminders/doctor-colored.svg'"></ion-img>
              <div class="ca__doctor__item__wrapper__content">
                <ion-text class="ui-font-profile-title"> Dr/a. {{ this.doctor?.lastName }}</ion-text>
                <ion-text class="ui-font-profile-email-title" color="complementary">{{ this.doctor?.field }}</ion-text>
              </div>
            </div>
          </ion-item>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div class="ca__data">
          <ion-text class="ui-font-profile-label"
            >Dirección de atención: {{ this.doctor?.streetName }} {{ this.doctor?.streetNumber }}</ion-text
          >
          <ion-input
            class="ui-form-input"
            [disabled]="true"
            placeholder="Fecha de Atencion"
            formControlName="date"
            id="open-modal"
          >
          </ion-input>
          <ion-modal trigger="open-modal" class="calendar-modal-time">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #bdt
                  [value]="this.minDate"
                  [min]="this.minDate"
                  locale="es-ES"
                  (ionChange)="dateChanged(bdt.value)"
                  [showDefaultButtons]="true"
                >
                  <span slot="time-label">Tiempo</span>
                  <ion-buttons slot="buttons">
                    <ion-button color="primary" (click)="confirmDateSelection()">Confirmar</ion-button>
                  </ion-buttons>
                </ion-datetime>
              </ion-content>
            </ng-template>
          </ion-modal>
          <ion-textarea
            rows="8"
            class="ui-form-input"
            placeholder="Comentarios"
            formControlName="comments"
          ></ion-textarea>
        </div>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Crear turno
      </ion-button>
    </ion-footer>`,
  styleUrls: ['./create-appointment.page.scss'],
})
export class CreateAppointmentPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  form = this.fb.group({
    date: null,
    comments: '',
  });
  showCalendar = false;
  minDate = formatISO(new Date());
  doctor: Professional;
  appointmentDate;
  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private appointmentDataService: AppointmentDataService,
    private appointmentsService: AppointmentsService,
    private toastService: ToastService,
    private navController: NavController,
    private localNotificationsService: LocalNotificationsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.doctor = this.appointmentDataService.data;
    this.form.addControl('myProfessional', new FormControl(this.doctor));
  }

  dateChanged(date: string) {
    this.appointmentDate = date;
    this.form.get('date').setValue(this.dateFormatterService.getSpanishFormattedDate(date));
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }

  async onSubmit() {
    this.form.get('date').setValue(this.appointmentDate);
    await this.appointmentsService
      .createAppointment(this.form.value)
      .then((res: any) => this.successCreation(res.appointment));
  }

  successCreation(appointment) {
    this.createNotification(appointment);
    this.toastService.showSuccess('Turno creado correctamente.');
    this.navController.navigateRoot(['/tabs/appointments']);
  }

  createNotification(appointment) {
    this.localNotificationsService.requestPermissions();
    this.localNotificationsService.registerActionTypes();
    this.localNotificationsService.addEventListener((res) => {
      this.confirmAppointment(res);
    });
    this.localNotificationsService.schedule(appointment.date, appointment.professional);
  }

  confirmAppointment(data) {
    console.log(data);
  }
}
