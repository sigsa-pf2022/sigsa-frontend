import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { isBefore, parseISO } from 'date-fns';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AppointmentsService } from './shared/services/appointments/appointments.service';

@Component({
  selector: 'app-appointments',
  template: `<ion-content class="apts">
    <ion-label class="apts__title"> Mis Turnos </ion-label>
    <form [formGroup]="this.searchForm" class="apts__search">
      <ion-searchbar
        formControlName="search"
        placeholder="Buscar turno ..."
        class="ui-search-input  ui-search-input__no-show"
        debounce="400"
        type="string"
        (ionChange)="handleChange($event)"
      ></ion-searchbar>
    </form>
    <cdk-virtual-scroll-viewport itemSize="1">
      <app-appointments-item-list
        *ngFor="let appointment of this.filteredAppointments"
        [appointment]="appointment"
        (click)="presentActionSheet(appointment)"
      ></app-appointments-item-list>
    </cdk-virtual-scroll-viewport>
    <div>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="newAppointment()" class="apts__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </div>
  </ion-content>`,
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  searchForm = this.fb.group({
    search: '',
  });
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private appointmentsService: AppointmentsService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    console.log('fasfafs');
    this.setAppointments();
  }

  ionViewDidEnter() {
    console.log('asdasd');
  }

  async setAppointments() {
    this.appointments = [...(await this.appointmentsService.getAppointmentsByUser())];
    this.filteredAppointments = this.appointments;
  }

  async presentActionSheet(appointment) {
    const actionSheet = isBefore(parseISO(appointment.date), new Date())
      ? await this.actionSheetService.createOnlyView('Mi Turno')
      : await this.actionSheetService.createDefault('Mi Turno');
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doActionByRole(role, appointment.id);
  }

  doActionByRole(value: string, id: number) {
    console.log(value);
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
    const search = event.detail.value;
    this.filteredAppointments = this.appointments.filter(
      (d) => d.professional.firstName.includes(search) || d.professional.lastName.includes(search)
    );
  }

  newAppointment() {
    return this.navController.navigateRoot(['/appointments/create/pick-doctor']);
  }

  editAppointment(id) {
    return this.navController.navigateRoot([`/appointments/edit/${id}/pick-doctor`]);
  }

  viewAppointment(id) {
    return this.navController.navigateRoot([`/appointments/view/${id}`]);
  }
}
