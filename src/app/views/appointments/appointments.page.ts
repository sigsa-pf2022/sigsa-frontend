import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AppointmentsService } from './shared/services/appointments/appointments.service';
import { slideUpAnimation } from 'src/app/animations/slide-up.animation';

@Component({
  selector: 'app-appointments',
  template: `
    <ion-content class="listing apts">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Tus consultas</p>
        <h1 class="listing-header__title">Mis turnos</h1>
      </header>

      <app-loading-state *ngIf="this.isLoading" [rows]="5"></app-loading-state>

      <ng-container *ngIf="!this.isLoading">
        <ng-container *ngIf="this.appointments.length > 0; else emptyState">
          <form [formGroup]="this.searchForm" class="listing-search">
            <ion-searchbar
              class="listing-searchbar"
              formControlName="search"
              placeholder="Buscar profesional..."
              debounce="400"
              type="string"
              mode="md"
              (ionChange)="handleChange($event)"
            ></ion-searchbar>
          </form>

          <cdk-virtual-scroll-viewport itemSize="80" class="listing-scroll">
            <app-appointments-item-list
              *cdkVirtualFor="let appointment of this.filteredAppointments"
              [appointment]="appointment"
              [flush]="true"
              (click)="presentActionSheet(appointment)"
            ></app-appointments-item-list>
          </cdk-virtual-scroll-viewport>
        </ng-container>

        <ng-template #emptyState>
          <div class="empty-state" role="status">
            <div class="empty-state__icon" aria-hidden="true">
              <ion-icon name="calendar"></ion-icon>
            </div>
            <h2 class="empty-state__title">Sin turnos por ahora</h2>
            <p class="empty-state__subtitle">
              Agendá tu próxima consulta y la vas a ver acá con todos los recordatorios.
            </p>
            <button type="button" class="empty-state__cta" (click)="newAppointment()">
              <ion-icon name="add"></ion-icon>
              Agendar turno
            </button>
          </div>
        </ng-template>
      </ng-container>

      <ion-fab class="app-fab" vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button
          class="app-fab-button"
          (click)="newAppointment()"
          aria-label="Agendar turno"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit, OnDestroy {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  isLoading = true;
  searchForm = this.fb.group({
    search: '',
  });
  private appointmentsChangedSub?: Subscription;
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private appointmentsService: AppointmentsService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // El flujo de creación vive en una ruta fuera de los tabs, por lo que al
    // volver a /tabs/appointments la página cacheada no siempre dispara
    // ionViewWillEnter. Nos suscribimos a los cambios para refrescar el listado.
    this.appointmentsChangedSub = this.appointmentsService.appointmentsChanged$.subscribe(() =>
      this.setAppointments()
    );
  }

  ngOnDestroy() {
    this.appointmentsChangedSub?.unsubscribe();
  }

  async ionViewWillEnter() {
    this.setAppointments();
  }

  async setAppointments() {
    // Solo mostramos el skeleton si no hay nada en pantalla: al volver a la
    // tab refrescamos en silencio sobre los datos que ya se ven.
    this.isLoading = this.appointments.length === 0;
    try {
      this.appointments = [...(await this.appointmentsService.getAppointmentsByUser())];
      this.filteredAppointments = this.appointments;
    } catch (error) {
      console.error('AppointmentsPage: error cargando turnos', error);
    } finally {
      this.isLoading = false;
    }
  }

  async presentActionSheet(appointment) {
    const actionSheet = await this.createActionSheet(appointment);
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doActionByRole(role, appointment.id);
  }

  async createActionSheet(appointment){
    if (appointment.status == 'confirmed' && isAfter(parseISO(appointment.date), new Date())) {
      return await this.actionSheetService.createOnlyView('Mi Turno');
    }
    return await this.actionSheetService.createDefault('Mi Turno');
  }

  doActionByRole(value: string, id: number) {
    switch (value) {
      case 'destructive':
        this.cancelAppointment(id);
        break;
      case 'edit':
        this.editAppointment(id);
        break;
      case 'view':
        this.viewAppointment(id);
        break;
      default:
        break;
    }
  }

  async cancelAppointment(id: number) {
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
        .cancelAppointment(id)
        .then(() => this.toastService.showSuccess('Turno cancelado correctamente.'))
        .then(() => this.setAppointments())
        .catch(() => {});
    }
  }

  async handleChange(event) {
    const search = (event.detail.value || '').toLowerCase();
    this.filteredAppointments = this.appointments.filter(
      (d) =>
        (d?.professional?.firstName ?? '').toLowerCase().includes(search) ||
        (d?.professional?.lastName ?? '').toLowerCase().includes(search)
    );
  }

  newAppointment() {
    return this.navController.navigateForward(['/appointments/create/pick-doctor'], { animation: slideUpAnimation });
  }

  editAppointment(id) {
    return this.navController.navigateRoot([`/appointments/edit/${id}/pick-doctor`]);
  }

  viewAppointment(id) {
    return this.navController.navigateRoot([`/appointments/view/${id}`]);
  }
}
