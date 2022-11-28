import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';

@Component({
  selector: 'app-view-appointment',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/appointments"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Turno</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="va">
      <div class="va__doctor">
        <div class="va__doctor__background">
          <ion-item lines="none" class="va__doctor__item no-padding">
            <div class="va__doctor__item__wrapper">
              <ion-img [src]="'assets/images/reminders/doctor-colored.svg'"></ion-img>
              <div class="va__doctor__item__wrapper__content">
                <ion-text class="ui-font-profile-title"> Dr/a. {{ this.appointment?.professional?.lastName }}</ion-text>
              </div>
            </div>
          </ion-item>
        </div>
      </div>
      <div class="va__data">
        <div class="va__data__item">
          <ion-text class="va__data__item__label">Fecha:</ion-text>
          <ion-text class="va__data__item__value">{{ this.appointment?.date | date: 'dd/MM/YYYY HH:mm' }}</ion-text>
        </div>
        <div class="va__data__item">
          <ion-text class="va__data__item__label">Descripcion:</ion-text>
          <ion-text class="va__data__item__value">{{ this.appointment?.description }}</ion-text>
        </div>
      </div>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="confirmAppointment()" expand="block" color="primary"> Confirmar </ion-button>
      <ion-button (click)="cancelAppointment()" expand="block" color="danger"> Cancelar </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./view-appointment.component.scss'],
})
export class ViewAppointmentComponent implements OnInit {
  appointmentId: number;
  appointment: any;
  constructor(
    private appointmentsService: AppointmentsService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAppointment();
  }

  async getAppointment() {
    this.appointment = await this.appointmentsService.getAppointment(this.appointmentId);
  }

  async confirmAppointment() {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea confirmar el turno?',
        yesColor: 'success'
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.appointmentsService
        .confirmAppointment(this.appointmentId)
        .then(() => this.toastService.showSuccess('Turno confirmado correctamente.'))
        .then(() => this.navController.navigateForward('/tabs/appointments'))
        .catch(() => {});
    }
  }

  async cancelAppointment() {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea cancelar el turno?',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.appointmentsService
        .cancelAppointment(this.appointmentId)
        .then(() => this.toastService.showSuccess('Turno cancelado correctamente.'))
        .then(() => this.navController.navigateForward('/tabs/appointments'))
        .catch(() => {});
    }
  }
}
