import { Component } from '@angular/core';
import { EventsService } from 'src/app/views/home/shared/services/events/events.service';
import { AppointmentsService } from '../appointments/shared/services/appointments/appointments.service';
import { REMINDERS_TYPE } from './shared/constants/remindersType';
import { MedsEventsService } from '../meds/shared/services/meds-events/meds-events.service';

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
  activeTab = null;
  events = [];
  reminders = [];
  medEvents = [];
  appointments = [];
  /** Skeleton del carrusel de próximos eventos. */
  isLoadingEvents = true;
  /** Skeleton de la lista de recordatorios (turnos + medicamentos). */
  isLoadingReminders = true;
  constructor(
    private appointmentsService: AppointmentsService,
    private eventsService: EventsService,
    private medsEventsService: MedsEventsService
  ) {}

  async ionViewWillEnter() {
    this.setAppointments();
    this.setNextEvents();
  }

  async setAppointments() {
    // Solo mostramos el skeleton si no hay nada en pantalla: al volver a la
    // tab refrescamos en silencio sobre los datos que ya se ven.
    this.isLoadingReminders = this.reminders.length === 0;
    try {
      // Las dos listas son independientes: en paralelo el skeleton dura la mitad.
      const [appointments, medEvents] = await Promise.all([
        this.appointmentsService.getAppointmentsByUser(),
        this.medsEventsService.getMedsEventsByUser(),
      ]);
      this.appointments = appointments;
      this.medEvents = medEvents;
      this.changeReminders(this.remindersTypes.appointments);
    } catch (error) {
      console.error('HomePage: error cargando recordatorios', error);
    } finally {
      this.isLoadingReminders = false;
    }
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

  changeReminders(value) {
    this.activeTab = value;
    switch (value) {
      case this.remindersTypes.appointments:
        this.reminders = this.appointments;
        break;
      case this.remindersTypes.medications:
        this.reminders = this.medEvents;
        break;
      case this.remindersTypes.documents:
        this.reminders = [];
        break;
    }
  }
}
