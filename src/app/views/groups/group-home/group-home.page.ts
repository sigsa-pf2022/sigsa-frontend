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
import { MedsEventDataService } from '../../meds/shared/services/meds-events-data/meds-events-data.service';
import { DocumentsService } from '../../documents/shared/services/documents.service';


@Component({
  selector: 'app-group-home',
  template: `
    <app-menu contentId="group-home" title="Menu del grupo" [options]="this.options"></app-menu>
    <div class="ui-main-menu-content" id="group-home">
      <ion-header class="auth-page-header" mode="md">
        <ion-toolbar class="auth-page-toolbar" mode="md">
          <div class="auth-topbar">
            <ion-menu-button class="app-menu-button" aria-label="Menú del grupo">
              <ion-icon name="menu-outline"></ion-icon>
            </ion-menu-button>
            <button
              type="button"
              class="auth-back"
              (click)="exitGroup()"
              aria-label="Volver"
            >
              <ion-icon name="close"></ion-icon>
            </button>
          </div>
        </ion-toolbar>
      </ion-header>

      <ion-content class="listing gh" *ngIf="this.group">
        <header class="listing-header gh__header">
          <p class="listing-header__eyebrow">Grupo familiar</p>
          <h1 class="listing-header__title">{{ this.group.name | titlecase }}</h1>
        </header>

        <article class="group-card" *ngIf="this.group.dependent">
          <div class="group-card__head">
            <div class="group-card__avatar" aria-hidden="true">
              <ion-icon name="person"></ion-icon>
            </div>
            <div class="group-card__heading">
              <p class="group-card__role">Dependiente</p>
              <p class="group-card__name">
                {{ this.group.dependent.firstName | titlecase }} {{ this.group.dependent.lastName | titlecase }}
              </p>
            </div>
          </div>
          <div class="group-card__meta">
            <div class="group-card__meta-item">
              <span class="group-card__meta-label">Nacimiento</span>
              <span class="group-card__meta-value">{{ this.group.dependent.birthday | date: 'dd/MM/yyyy' }}</span>
            </div>
            <div class="group-card__meta-item">
              <span class="group-card__meta-label">DNI</span>
              <span class="group-card__meta-value">{{ this.group.dependent.dni }}</span>
            </div>
            <div class="group-card__meta-item">
              <span class="group-card__meta-label">Grupo sanguíneo</span>
              <span class="group-card__meta-value">{{ this.group.dependent.bloodType || '—' }}</span>
            </div>
          </div>
        </article>

        <ion-item
          *ngIf="pendingRequestsCount > 0"
          class="alert-card"
          lines="none"
          [button]="true"
          detail="false"
          (click)="openProfessionalRequests()"
        >
          <div class="alert-card__icon" aria-hidden="true">
            <ion-icon name="shield-checkmark"></ion-icon>
          </div>
          <div class="alert-card__body">
            <span class="alert-card__title">Solicitudes de profesionales</span>
            <span class="alert-card__subtitle">
              {{ pendingRequestsCount }} pendiente{{ pendingRequestsCount === 1 ? '' : 's' }} para revisar
            </span>
          </div>
          <span class="alert-card__badge">{{ pendingRequestsCount }}</span>
        </ion-item>

        <div class="section-title">
          <h2>Próximos eventos</h2>
          <span *ngIf="events?.length">{{ events.length }}</span>
        </div>

        <app-next-events [events]="this.events"></app-next-events>

        <app-reminders
          height="37vh"
          [reminders]="this.reminders"
          [activeTab]="this.currentReminderType"
          (tabChanged)="changeReminders($event)"
          (itemClicked)="onReminderItemClicked($event)"
        ></app-reminders>

        <ion-fab class="app-fab gh__fab" vertical="bottom" horizontal="center" slot="fixed">
          <ion-fab-button
            class="app-fab-button"
            (click)="openFabList($event)"
            aria-label="Crear recordatorio"
          >
            <ion-icon [name]="opened ? 'close' : 'add'"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="top" class="gh__fab__list" #fabList>
            <ion-fab-button
              class="sub-fab-button"
              (click)="createMedication()"
              aria-label="Crear medicamento"
            >
              <ion-icon name="medkit"></ion-icon>
            </ion-fab-button>
            <ion-fab-button
              class="sub-fab-button"
              (click)="createAppointment()"
              aria-label="Crear turno"
            >
              <ion-icon name="calendar"></ion-icon>
            </ion-fab-button>
            <ion-fab-button
              class="sub-fab-button"
              (click)="createDocument()"
              aria-label="Crear documento"
            >
              <ion-icon name="document-text"></ion-icon>
            </ion-fab-button>
          </ion-fab-list>
        </ion-fab>
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
  pendingRequestsCount = 0;
  private remindersRequestId = 0;

  constructor(
    private animationCtrl: AnimationController,
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private navController: NavController,
    private authService: AuthenticationService,
    private eventsService: EventsService,
    private appointmentsService: AppointmentsService,
    private medsEventsService: MedsEventsService,
    private medsEventDataService: MedsEventDataService,
    private documentsService: DocumentsService,
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
      { title: 'Ver miembros', icon: 'people-outline', action: 'see-members', groupId: this.group?.id, memberId: currentUser?.id },
      { title: 'Abandonar grupo', icon: 'exit-outline', color: 'danger', action: 'exit-group', groupId: this.group?.id, memberId: currentUser?.id },
      { title: 'Salir', icon: 'log-out-outline', color: 'danger', action: 'logout' },
    ];

    // Cargar datos secuencialmente para garantizar consistencia
    await this.loadDependentEvents();
    await this.loadDependentReminders();
    await this.loadPendingRequestsCount();
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
    if (this.group?.dependent?.id) {
      await this.changeReminders(this.currentReminderType);
    }
  }

  private async loadPendingRequestsCount() {
    const currentUser = this.authService.user();
    const isAdmin = this.group?.createdBy?.id === currentUser?.id;
    if (!isAdmin || !this.group?.id) {
      this.pendingRequestsCount = 0;
      return;
    }
    try {
      const all = await this.groupsService.getProfessionalRequests();
      this.pendingRequestsCount = (all || []).filter(
        (r) => String(r.groupId) === String(this.group.id),
      ).length;
    } catch {
      this.pendingRequestsCount = 0;
    }
  }

  openProfessionalRequests() {
    this.navController.navigateForward([`/groups/professional-requests/${this.group.id}`]);
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

    // El viewport de app-reminders cambia de tipo de forma síncrona, pero la
    // carga es asíncrona: hay que vaciar la lista ANTES del await para que la
    // plantilla nueva no llegue a renderizar items del tipo anterior
    // (p.ej. turnos dentro de app-document-item-list).
    this.reminders = [];

    if (!this.group?.dependent?.id) return;

    // Si el usuario cambia de tab mientras una carga está en vuelo, la respuesta
    // vieja no debe pisar a la nueva.
    const requestId = ++this.remindersRequestId;

    try {
      let result = [];
      switch (value) {
        case REMINDERS_TYPE.appointments:
          result = await this.appointmentsService.getAppointmentsByDependent(this.group.dependent.id);
          break;
        case REMINDERS_TYPE.medications:
          result = await this.medsEventsService.getMedsEventsByDependent(this.group.dependent.id);
          break;
        case REMINDERS_TYPE.documents:
          result = await this.documentsService.getDocumentsByDependent(this.group.dependent.id);
          break;
      }
      if (requestId !== this.remindersRequestId) return;
      this.reminders = result || [];
    } catch (error) {
      console.error('Error cargando reminders:', error);
      if (requestId === this.remindersRequestId) this.reminders = [];
    }
  }

  async onReminderItemClicked(event: { item: any; type: string }) {
    if (!event?.item) return;
    if (event.type === REMINDERS_TYPE.appointments) {
      await this.presentAppointmentActionSheet(event.item);
    } else if (event.type === REMINDERS_TYPE.medications) {
      await this.presentMedEventActionSheet(event.item);
    } else if (event.type === REMINDERS_TYPE.documents) {
      await this.presentDocumentActionSheet(event.item);
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
      await this.appointmentsService
        .cancelAppointment(id)
        .then(() => this.changeReminders(this.currentReminderType))
        .catch(err => console.error('Error cancelando turno:', err));
    }
  }

  private editAppointment(id: number) {
    return this.navController.navigateForward([`/appointments/edit/${id}/pick-doctor`], {
      queryParams: this.groupContextParams(),
    });
  }

  private viewAppointment(id: number) {
    return this.navController.navigateForward([`/appointments/view/${id}`], {
      queryParams: this.groupContextParams(),
    });
  }

  /**
   * Contexto del grupo que se propaga a las vistas de ver/editar para que su
   * flecha de "volver" regrese al grupo y no a la pestaña personal.
   */
  private groupContextParams() {
    return {
      dependentId: this.group?.dependent?.id,
      dependentName: this.getDependentFullName(),
      groupId: this.group?.id,
    };
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
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.medsEventsService
        .cancelMedEvent(id)
        .then(() => this.changeReminders(this.currentReminderType))
        .catch(err => console.error('Error cancelando medicamento:', err));
    }
  }

  private editMedEvent(id: number) {
    this.medsEventDataService.clean();
    return this.navController.navigateForward([`/meds/edit/${id}/pick-med`], {
      queryParams: this.groupContextParams(),
    });
  }

  private viewMedEvent(id: number) {
    return this.navController.navigateForward([`/meds/view/${id}`], {
      queryParams: this.groupContextParams(),
    });
  }

  private async presentDocumentActionSheet(document: any) {
    const actionSheet = await this.createDocumentActionSheet(document);
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doDocumentActionByRole(role, document.id);
  }

  private async createDocumentActionSheet(document: any) {
    const depName = this.getDependentFullName();
    const formatted = depName ? this.toTitleCase(depName) : null;
    const baseTitle = formatted ? `Documento de ${formatted}` : 'Mi Documento';
    return await this.actionSheetService.createDefault(baseTitle);
  }

  private doDocumentActionByRole(value: string, id: number) {
    switch (value) {
      case 'destructive':
        this.deleteDocument(id);
        break;
      case 'edit':
        this.editDocument(id);
        break;
      case 'view':
        this.viewDocument(id);
        break;
      default:
        break;
    }
  }

  private async deleteDocument(id: number) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: { text: '¿Desea eliminar el documento?' },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      try {
        await this.documentsService.deleteDocument(id);
        // Recargar los documentos después de eliminar
        await this.changeReminders(REMINDERS_TYPE.documents);
      } catch (error) {
        console.error('Error eliminando documento:', error);
      }
    }
  }

  private editDocument(id: number) {
    return this.navController.navigateForward([`/documents/edit/${id}`], {
      queryParams: this.groupContextParams(),
    });
  }

  private viewDocument(id: number) {
    return this.navController.navigateForward([`/documents/view/${id}`], {
      queryParams: this.groupContextParams(),
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

    // Navegar a la creación de documento para el dependiente
    this.navController.navigateForward(['/documents/create'], {
      queryParams: {
        dependentId: this.group.dependent.id,
        dependentName: `${this.group.dependent.firstName} ${this.group.dependent.lastName}`,
        groupId: this.group.id
      }
    });
  }
}
