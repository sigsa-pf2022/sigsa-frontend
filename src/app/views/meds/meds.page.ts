import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { isBefore, parseISO } from 'date-fns';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MedsEventsService } from './shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-meds',
  template: `
    <ion-content class="meds">
      <ion-label class="meds__title"> Mis recordatorios de medicamentos </ion-label>
      <form [formGroup]="this.searchForm" class="meds__search">
        <ion-searchbar
          formControlName="search"
          placeholder="Buscar recordatorio ..."
          class="ui-search-input  ui-search-input__no-show"
          debounce="400"
          type="string"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>
      <cdk-virtual-scroll-viewport itemSize="1">
        <app-meds-event-item-list
          *ngFor="let medEvent of this.filteredMedsEvents"
          [medEvent]="medEvent"
          (click)="presentActionSheet(medEvent)"
        ></app-meds-event-item-list>
      </cdk-virtual-scroll-viewport>
      <div>
        <ion-fab vertical="bottom" horizontal="center" slot="fixed">
          <ion-fab-button (click)="newMedEvent()" class="meds__fab">
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </div>
    </ion-content>
  `,
  styleUrls: ['./meds.page.scss'],
})
export class MedsPage implements OnInit {
  medsEvents: any[] = [];
  filteredMedsEvents: any[] = [];
  searchForm = this.fb.group({
    search: '',
  });
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private medsEventsService: MedsEventsService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.setMedsEvents();
  }

  async setMedsEvents() {
    this.medsEvents = [...(await this.medsEventsService.getMedsEventsByUser())];
    this.filteredMedsEvents = this.medsEvents;
  }

  async presentActionSheet(medEvent) {
    const actionSheet = isBefore(parseISO(medEvent.date), new Date())
      ? await this.actionSheetService.createOnlyView('Mi Turno')
      : await this.actionSheetService.createDefault('Mi Turno');
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doActionByRole(role, medEvent.id);
  }

  doActionByRole(value: string, id: number) {
    switch (value) {
      case 'destructive':
        this.cancelMedEvent(id);
        break;
      case 'edit':
        this.editMedEvent(id);
        break;
      case 'view':
        this.viewMedEvent(id);
        break;
      default:
        break;
    }
  }

  async cancelMedEvent(id: number) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea cancelar el recordatorio de medicamento?',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      // await this.appointmentsService
      //   .cancelAppointment(id)
      //   .then(() => this.toastService.showSuccess('Turno cancelado correctamente.'))
      //   .then(() => this.setAppointments())
      //   .catch(() => {});
    }
  }

  async handleChange(event) {
    const search = event.detail.value;
    this.filteredMedsEvents = this.medsEvents.filter((d) => d.name.includes(search));
  }

  newMedEvent() {
    return this.navController.navigateRoot(['/meds/create/pick-med']);
  }

  editMedEvent(id) {
    return this.navController.navigateRoot([`/meds/edit/${id}/pick-med`]);
  }

  viewMedEvent(id) {
    return this.navController.navigateRoot([`/meds/view/${id}`]);
  }
}
