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

        <app-next-events [events]="this.events"></app-next-events>

        <app-reminders
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
    this.appointments = await this.appointmentsService.getAppointmentsByUser();
    this.medEvents = await this.medsEventsService.getMedsEventsByUser();
    this.changeReminders(this.remindersTypes.appointments);
  }
  async setNextEvents() {
    this.events = await this.eventsService.getNextEvents();
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
