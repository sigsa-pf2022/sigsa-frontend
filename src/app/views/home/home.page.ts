import { Component } from '@angular/core';
import { EventsService } from 'src/app/views/home/shared/services/events/events.service';
import { AppointmentsService } from '../appointments/shared/services/appointments/appointments.service';
import { REMINDERS_TYPE } from './shared/constants/remindersType';
import { MedsEventsService } from '../meds/shared/services/meds-events/meds-events.service';
import { DocumentsService } from '../documents/shared/services/documents.service';

@Component({
  selector: 'app-home',
  template: `
    <ion-content class="home">
      <div class="home__container">
        <div class="home__title-block">
          <p class="home__greeting">Hola 👋</p>
          <h1 class="home__title">Próximos eventos</h1>
        </div>

        <app-next-events
          [events]="this.events"
          [loading]="this.isLoadingEvents"
        ></app-next-events>

        <app-reminders
          [loading]="this.isLoadingReminders"
          [activeTab]="this.activeTab"
          [reminders]="this.reminders"
          (tabChanged)="this.changeReminders($event)"
        ></app-reminders>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  remindersTypes = REMINDERS_TYPE;
  activeTab = REMINDERS_TYPE.appointments;
  events = [];
  reminders = [];
  /** Skeleton del carrusel de próximos eventos. */
  isLoadingEvents = true;
  /** Skeleton de la lista de recordatorios. */
  isLoadingReminders = true;
  private remindersRequestId = 0;

  constructor(
    private appointmentsService: AppointmentsService,
    private eventsService: EventsService,
    private medsEventsService: MedsEventsService,
    private documentsService: DocumentsService
  ) {}

  async ionViewWillEnter() {
    // Respetamos la pestaña que el usuario venía mirando: antes se forzaba
    // "Turnos" después de cada carga y si tocabas otra mientras la request
    // estaba en vuelo, la respuesta te devolvía a Turnos.
    this.changeReminders(this.activeTab);
    this.setNextEvents();
  }

  async setNextEvents() {
    this.isLoadingEvents = this.events.length === 0;
    try {
      this.events = await this.eventsService.getNextEvents();
    } catch (error) {
      console.error('HomePage: error cargando próximos eventos', error);
    } finally {
      this.isLoadingEvents = false;
    }
  }

  /**
   * Una request por pestaña, igual que en el home del grupo. Vaciamos la lista
   * antes del await para que la plantilla nueva no llegue a renderizar items
   * del tipo anterior, y descartamos las respuestas viejas si el usuario
   * cambió de pestaña mientras tanto.
   */
  async changeReminders(value) {
    this.activeTab = value;
    this.reminders = [];

    const requestId = ++this.remindersRequestId;
    this.isLoadingReminders = true;

    try {
      let result = [];
      switch (value) {
        case this.remindersTypes.appointments:
          result = await this.appointmentsService.getAppointmentsByUser();
          break;
        case this.remindersTypes.medications:
          // Agrupado por tratamiento, igual que la pestaña Medicación.
          result = await this.medsEventsService.getTreatmentsByUser();
          break;
        case this.remindersTypes.documents:
          result = await this.documentsService.getDocumentsByUser();
          break;
      }
      if (requestId !== this.remindersRequestId) return;
      this.reminders = result || [];
    } catch (error) {
      console.error('HomePage: error cargando recordatorios', error);
      if (requestId === this.remindersRequestId) this.reminders = [];
    } finally {
      if (requestId === this.remindersRequestId) this.isLoadingReminders = false;
    }
  }
}
