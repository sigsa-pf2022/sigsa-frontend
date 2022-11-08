import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
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
          <ion-modal trigger="open-modal" class="calendar-modal">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #bdt
                  [value]="this.minDate"
                  [min]="this.minDate"
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
    doctorId: null
  });
  showCalendar = false;
  minDate = format(new Date(), 'yyyy-MM-dd');
  doctor: Professional;
  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private appointmentDataService: AppointmentDataService,
    private appointmentsService: AppointmentsService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.doctor = this.appointmentDataService.data;
    this.form.get('doctorId').setValue(this.doctor.id);
  }

  dateChanged(date: string) {
    this.form
      .get('date')
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

  onSubmit() {
    this.appointmentsService.createAppointment(this.form.value);
  }
}
