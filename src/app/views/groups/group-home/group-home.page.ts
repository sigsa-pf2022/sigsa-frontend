import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationController, NavController, ModalController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { parseISO, isAfter, isBefore } from 'date-fns';
import { REMINDERS_TYPE } from '../../home/shared/constants/remindersType';
import { FAKE_APPOINTMENTS_REMINDERS_DATA } from '../../home/shared/fakes/fakeAppointmentsReminderData';
import { FAKE_DOCUMENTS_REMINDERS_DATA } from '../../home/shared/fakes/fakeDocumentsReminderData';
import { FAKE_MEDICATIONS_REMINDERS_DATA } from '../../home/shared/fakes/fakeMedicationsReminderData';
import { FamilyGroup } from '../shared/interfaces/family-group.interface';
import { GroupsService } from '../shared/services/groups/groups.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { EventsService } from '../../home/shared/services/events/events.service';
import { AppointmentsService } from '../../appointments/shared/services/appointments/appointments.service';
import { MedsEventsService } from '../../meds/shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-group-home',
  template: `
    <app-menu contentId="group-home" title="Menu del grupo" [options]="this.options"></app-menu>
    <div class="ui-main-menu-content" id="group-home">
      <ion-header class="ui-background__light">
        <ion-toolbar class="ui-toolbar__primary">
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title *ngIf="this.group" class="ui-header__title-center">{{ this.group.name | titlecase }}</ion-title>
          <ion-buttons slot="end">
            <ion-icon (click)="exitGroup()" name="log-out-outline"></ion-icon>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="gh" *ngIf="this.group">
        <div>
          <ion-item lines="none" class="gh__item ion-no-padding">
            <div class="gh__item__wrapper">
              <!-- <div class="gh__item__wrapper__img"> -->
              <!-- <ion-img [src]="this.group.imgUrl"></ion-img> -->
              <!-- </div> -->
              <div class="gh__item__wrapper__icon">
                <ion-icon color="primary" name="person-circle"></ion-icon>
              </div>
              <div class="gh__item__wrapper__data">
                <ion-text class="item__wrapper__data__title"
                  >{{ this.group.dependent.lastName | titlecase }}, {{ this.group.dependent.firstName | titlecase }}</ion-text
                >
                <ion-text class="gh__item__wrapper__data__info"
                  ><b>Fecha de nacimiento:</b> {{ this.group.dependent.birthday | date : 'dd/MM/YYYY' }}</ion-text
                >
                <ion-text class="gh__item__wrapper__data__info"><b>DNI:</b> {{ this.group.dependent.dni }}</ion-text>
                <ion-text class="gh__item__wrapper__data__info"
                  ><b>Grupo sanguíneo:</b> {{ this.group.dependent.bloodType }}</ion-text
                >
              </div>
            </div>
          </ion-item>
          <app-next-events [events]="this.events"></app-next-events>
          <app-reminders
            height="37vh"
            [reminders]="this.reminders"
            [activeTab]="this.currentReminderType"
            (tabChanged)="changeReminders($event)"
            (itemClicked)="onReminderItemClicked($event)"
          ></app-reminders>
          <ion-fab class="gh__fab" vertical="bottom" horizontal="center" slot="fixed">
            <ion-fab-button (click)="openFabList($event)">
              <ion-icon name="add"></ion-icon>
            </ion-fab-button>
            <ion-fab-list side="top" class="gh__fab__list" #fabList>
              <div class="gh__fab__list__button" (click)="createMedication()">
                <img [src]="'/assets/images/reminders/pill.svg'" />
                <ion-text color="light">Medicamento</ion-text>
              </div>
              <div class="gh__fab__list__button" (click)="createAppointment()">
                <img [src]="'/assets/images/reminders/doctor.svg'" />
                <ion-text color="light">Turno</ion-text>
              </div>
              <div class="gh__fab__list__button" (click)="createDocument()">
                <img [src]="'/assets/images/reminders/document.svg'" />
                <ion-text color="light">Documento</ion-text>
              </div>
            </ion-fab-list>
          </ion-fab>
        </div>
      </ion-content>
    </div>
  `,
  styleUrls: ['./group-home.page.scss'],
})
export class GroupHomePage implements OnInit {
  @ViewChild('fabList', { read: ElementRef }) fabListRef: ElementRef;
  events = [];
  opened = false;
  group: FamilyGroup;
  reminders: any = [];
  currentReminderType: string = REMINDERS_TYPE.appointments;
  options: any;

  constructor(
    private animationCtrl: AnimationController,
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private navController: NavController,
    private authService: AuthenticationService,
    private eventsService: EventsService,
    private appointmentsService: AppointmentsService,
    private medsEventsService: MedsEventsService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    // Reset completo de estado
    this.group = null;
    this.events = [];
    this.reminders = [];

    const groupId = this.route.snapshot.paramMap.get('id');
    this.group = await this.groupsService.getFamilyGroupById(groupId);
    const currentUser = this.authService.user();

    this.options = [
      { title: 'Documentos', icon: 'document-outline', action: 'documents' },
      { title: 'Ver miembros', icon: 'people-outline', action: 'see-members', groupId: this.group?.id, memberId: currentUser?.id },
      { title: 'Abandonar grupo', icon: 'exit-outline', color: 'danger', action: 'exit-group', groupId: this.group?.id, memberId: currentUser?.id },
      { title: 'Salir', icon: 'log-out-outline', color: 'danger', action: 'logout' },
    ];

    // Cargar datos secuencialmente para garantizar consistencia
    await this.loadDependentEvents();
    await this.loadDependentReminders();
  }

  async ionViewDidEnter() {
  // Ya se cargó en ionViewWillEnter; evitar doble carga que puede mostrar datos viejos momentáneamente
  }

  private async loadDependentEvents() {
    // Cargar eventos del dependiente
    if (this.group?.dependent?.id) {
      try {
        this.events = await this.eventsService.getNextEventsByDependent(this.group.dependent.id);
      } catch (error) {
        console.error('Error cargando eventos del dependiente:', error);
        this.events = [];
      }
    }
  }

  private async loadDependentReminders() {
    // Cargar reminders del dependiente según el tipo actual
    if (this.group?.dependent?.id) {
      await this.changeReminders(this.currentReminderType);
    }
  }

  openFabList(ev: Event) {
    if (this.opened) {
      ev.stopPropagation();
      this.closeAnimation();
    } else {
      this.openAnimation();
    }
    this.opened = !this.opened;
  }
  closeAnimation() {
    this.animationCtrl
      .create()
      .addElement(this.fabListRef.nativeElement)
      .duration(250)
      .fromTo('opacity', '1', '0')
      .play()
      .then(() => {
        this.fabListRef.nativeElement.click();
      });
  }
  openAnimation() {
    this.animationCtrl
      .create()
      .addElement(this.fabListRef.nativeElement)
      .duration(250)
      .fromTo('opacity', '0', '1')
      .play();
  }

  async changeReminders(value) {
    this.currentReminderType = value;
    if (!this.group?.dependent?.id) {
      this.reminders = [];
      return;
    }

    try {
      switch (value) {
        case REMINDERS_TYPE.appointments:
          this.reminders = await this.appointmentsService.getAppointmentsByDependent(this.group.dependent.id);
          break;
        case REMINDERS_TYPE.medications:
          this.reminders = await this.medsEventsService.getMedsEventsByDependent(this.group.dependent.id);
          break;
        case REMINDERS_TYPE.documents:
          // TODO: Implementar cuando tengamos el servicio de documentos
          this.reminders = [];
          break;
        default:
          this.reminders = [];
      }
    } catch (error) {
      console.error('Error cargando reminders:', error);
      this.reminders = [];
    }
  }

  async onReminderItemClicked(event: { item: any; type: string }) {
    if (!event?.item) return;
    if (event.type === REMINDERS_TYPE.appointments) {
      await this.presentAppointmentActionSheet(event.item);
    } else if (event.type === REMINDERS_TYPE.medications) {
      await this.presentMedEventActionSheet(event.item);
    }
  }

  private async presentAppointmentActionSheet(appointment: any) {
    const actionSheet = await this.createAppointmentActionSheet(appointment);
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doAppointmentActionByRole(role, appointment.id);
  }

  private async createAppointmentActionSheet(appointment: any) {
    const depName = this.getDependentFullName();
    const formatted = depName ? this.toTitleCase(depName) : null;
    const baseTitle = formatted ? `Turno de ${formatted}` : 'Mi Turno';
    if (appointment.status === 'confirmed' && isAfter(parseISO(appointment.date), new Date())) {
      return await this.actionSheetService.createOnlyView(baseTitle);
    }
    return await this.actionSheetService.createDefault(baseTitle);
  }

  private doAppointmentActionByRole(value: string, id: number) {
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

  private async cancelAppointment(id: number) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: { text: '¿Desea cancelar el turno?' },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      // TODO: Integrar con appointmentsService.cancelAppointment(id) si es necesario en contexto de grupo
    }
  }

  private editAppointment(id: number) {
    return this.navController.navigateForward([`/appointments/edit/${id}/pick-doctor`]);
  }

  private viewAppointment(id: number) {
    return this.navController.navigateForward([`/appointments/view/${id}`]);
  }

  private async presentMedEventActionSheet(medEvent: any) {
    const actionSheet = await this.createMedEventActionSheet(medEvent);
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doMedEventActionByRole(role, medEvent.id);
  }

  private async createMedEventActionSheet(medEvent: any) {
    const depName = this.getDependentFullName();
    const formatted = depName ? this.toTitleCase(depName) : null;
    const baseTitle = formatted ? `Medicamento de ${formatted}` : 'Mi Medicamento';
    if (medEvent.status === 'confirmed' && isBefore(parseISO(medEvent.date), new Date())) {
      return await this.actionSheetService.createOnlyView(baseTitle);
    }
    return await this.actionSheetService.createDefault(baseTitle);
  }

  private doMedEventActionByRole(value: string, id: number) {
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

  private async cancelMedEvent(id: number) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: { text: '¿Desea cancelar el recordatorio de medicamento?' },
    });
    await modal.present();
    await modal.onWillDismiss();
    // TODO: Integrar con medsEventsService.cancelMedEvent(id) si existe en contexto de grupo
  }

  private editMedEvent(id: number) {
    return this.navController.navigateForward([`/meds/edit/${id}/pick-med`], {
      queryParams: {
        dependentId: this.group?.dependent?.id,
        dependentName: `${this.group?.dependent?.firstName} ${this.group?.dependent?.lastName}`,
        groupId: this.group?.id
      }
    });
  }

  private viewMedEvent(id: number) {
    return this.navController.navigateForward([`/meds/view/${id}`], {
      queryParams: { dependentId: this.group?.dependent?.id }
    });
  }

  private getDependentFullName(): string | null {
    const first = this.group?.dependent?.firstName?.trim();
    const last = this.group?.dependent?.lastName?.trim();
    if (!first && !last) return null;
    return [first, last].filter(Boolean).join(' ');
  }

  private toTitleCase(value: string): string {
    return value
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  exitGroup() {
    this.navController.navigateBack(['/tabs/groups']);
  }

  createAppointment() {
    // Cerrar el FAB primero
    if (this.opened) {
      this.closeAnimation();
      this.opened = false;
    }
    
    // Navegar a la creación de turno para el dependiente
    this.navController.navigateForward(['/appointments/create/pick-doctor'], {
      queryParams: {
        dependentId: this.group.dependent.id,
        dependentName: `${this.group.dependent.firstName} ${this.group.dependent.lastName}`,
        groupId: this.group.id
      }
    });
  }

  createMedication() {
    // Cerrar el FAB primero
    if (this.opened) {
      this.closeAnimation();
      this.opened = false;
    }
    // Navegar al flujo de creación de medicamento para el dependiente
    this.navController.navigateForward(['/meds/create/pick-med'], {
      queryParams: {
        dependentId: this.group.dependent.id,
        dependentName: `${this.group.dependent.firstName} ${this.group.dependent.lastName}`,
        groupId: this.group.id
      }
    });
  }

  createDocument() {
    // Cerrar el FAB primero
    if (this.opened) {
      this.closeAnimation();
      this.opened = false;
    }
    
    // TODO: Implementar navegación a creación de documento para dependiente
    console.log('Crear documento para dependiente:', this.group.dependent);
  }
}
