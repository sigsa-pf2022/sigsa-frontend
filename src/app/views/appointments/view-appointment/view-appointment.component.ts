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
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Consulta</p>
        <h1 class="listing-header__title">Turno</h1>
      </header>

      <ng-container *ngIf="appointment">
        <article class="va__summary">
          <div class="va__summary-icon" aria-hidden="true">
            <ion-icon name="calendar"></ion-icon>
          </div>
          <div class="va__summary-body">
            <p class="va__summary-name">
              Dr/a. {{ appointment?.professional?.firstName }} {{ appointment?.professional?.lastName }}
            </p>
            <p class="va__summary-meta" *ngIf="appointment?.professional?.specialization?.[0]?.name">
              {{ appointment.professional.specialization[0].name }}
            </p>
          </div>
          <span
            *ngIf="appointment?.status"
            class="status-badge"
            [ngClass]="statusBadgeClass"
          >
            {{ statusLabel }}
          </span>
        </article>

        <section class="va__section">
          <div class="section-title va__section-title">
            <h2>Detalles</h2>
          </div>
          <div class="va__card">
            <div class="va__row">
              <span class="va__row-label">Fecha y hora</span>
              <span class="va__row-value">{{ appointment?.date | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="va__row" *ngIf="appointment?.description">
              <span class="va__row-label">Comentarios</span>
              <span class="va__row-value">{{ appointment?.description }}</span>
            </div>
          </div>
        </section>
      </ng-container>
    </ion-content>

    <ion-footer class="auth-footer" mode="md" *ngIf="appointment">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        *ngIf="!isConfirmed"
        (click)="confirmAppointment()"
      >
        <ion-icon name="checkmark" aria-hidden="true"></ion-icon>
        Confirmar turno
      </button>
      <button
        type="button"
        class="auth-btn va__btn-danger"
        (click)="cancelAppointment()"
      >
        Cancelar turno
      </button>
    </ion-footer>
  `,
  styleUrls: ['./view-appointment.component.scss'],
})
export class ViewAppointmentComponent implements OnInit {
  appointmentId: number;
  appointment: any;
  groupId: string | null = null;
  isConfirmed: boolean = false;
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
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    this.getAppointment();
  }

  goBack() {
    // Si venimos del home de un grupo, volvemos ahí y no a la pestaña personal.
    const fallback = this.groupId ? `/groups/home/${this.groupId}` : '/tabs/appointments';
    this.navController.navigateBack([fallback]);
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      confirmed: 'CONFIRMADO',
      created: 'CREADO',
      canceled: 'CANCELADO',
    };
    return map[this.appointment?.status] || (this.appointment?.status || '').toUpperCase();
  }

  get statusBadgeClass(): string {
    const map: Record<string, string> = {
      confirmed: 'status-badge--success',
      created: 'status-badge--violet',
      canceled: 'status-badge--danger',
    };
    return map[this.appointment?.status] || '';
  }

  async getAppointment() {
    try {
      this.appointment = await this.appointmentsService.getAppointment(this.appointmentId);
    } catch (error) {
      console.log(error);
    }
    this.isConfirmed = this.appointment && this.appointment.status === 'confirmed';
  }

  async confirmAppointment() {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea confirmar el turno?',
        yesColor: 'primary',
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
