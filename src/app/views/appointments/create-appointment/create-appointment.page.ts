import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonDatetime, NavController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { LocalNotificationsService } from 'src/app/services/local-notifications/local-notifications.service';
import { PlatformService } from 'src/app/services/platform/platform.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { AppointmentDataService } from '../shared/services/appointment-data/appointment-data.service';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';

@Component({
  selector: 'app-create-appointment',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="this.backUrl"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">{{ this.isEditMode ? 'Editar' : 'Crear' }} turno</ion-title>
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
              </div>
            </div>
          </ion-item>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div class="ca__data">
          <!-- <ion-text class="ui-font-profile-label" -->
          <!-- >Dirección de atención: {{ this.doctor?.streetName }} {{ this.doctor?.streetNumber }}</ion-text -->
          <!-- > -->
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
                  [value]="this.appointmentDate"
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
            formControlName="description"
          ></ion-textarea>
        </div>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>`,
  styleUrls: ['./create-appointment.page.scss'],
})
export class CreateAppointmentPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  form = this.fb.group({
    date: null,
    description: '',
  });
  showCalendar = false;
  minDate = formatISO(new Date());
  doctor: Professional;
  appointmentDate;
  appointmentId: number;
  isEditMode = false;
  backUrl: string;
  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private appointmentDataService: AppointmentDataService,
    private appointmentsService: AppointmentsService,
    private toastService: ToastService,
    private navController: NavController,
    private localNotificationsService: LocalNotificationsService,
    private platformService: PlatformService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.setMode();
  }

  setMode() {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.appointmentId) {
      this.isEditMode = true;
      this.setAppointmentInfo();
      this.backUrl = `/appointments/edit/${this.appointmentId}/pick-doctor`;
    } else {
      this.setProfessionalAndType(this.appointmentDataService.data);
      this.backUrl = `/appointments/create/pick-doctor`;
    }
  }

  setProfessionalAndType(doctor: any) {
    this.doctor = doctor;
    this.form.addControl(this.doctor.licenseNumber ? 'professional' : 'myProfessional', new FormControl(this.doctor));
  }

  setAppointmentInfo() {
    this.form.patchValue({ description: this.appointmentDataService.data.description });
    this.dateChanged(this.appointmentDataService.data.date);
    this.setProfessionalAndType(this.appointmentDataService.data.professional);
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
    return this.isEditMode ? this.editAppointment() : this.createAppointment();
  }

  async editAppointment() {
    await this.appointmentsService
      .editAppointment(this.form.value)
      .then((res: any) => this.successCreation(res.appointment));
  }

  async createAppointment() {
    await this.appointmentsService
      .createAppointment(this.form.value)
      .then((res: any) => this.successCreation(res.appointment));
  }

  successCreation(appointment) {
    this.createNotification(appointment);
    this.toastService.showSuccess('Turno creado correctamente.');
    return this.navController.navigateForward(['/tabs/appointments']);
  }

  createNotification(appointment) {
    this.localNotificationsService.requestPermissions();
    if (!this.platformService.isMobileWeb) {
      this.localNotificationsService.registerActionTypes();
      this.localNotificationsService.addEventListener((notification) => {
        this.dispatch(notification);
      });
    }
    this.localNotificationsService.schedule(appointment.date, appointment.professional);
  }

  dispatch(notification) {
    if (notification.actionId === 'confirm') {
      this.confirmAppointment();
    }
  }

  confirmAppointment() {}
}
