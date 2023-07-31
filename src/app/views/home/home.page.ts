import { Component } from '@angular/core';
import { EventsService } from 'src/app/views/home/shared/services/events/events.service';
import { AppointmentsService } from '../appointments/shared/services/appointments/appointments.service';
import { REMINDERS_TYPE } from './shared/constants/remindersType';

@Component({
  selector: 'app-home',
  template: `
    <ion-content class="home">
      <app-next-events [events]="this.events"></app-next-events>
      <app-reminders
        [activeTab]="this.activeTab"
        [reminders]="this.reminders"
        (tabChanged)="this.changeReminders($event)"
      ></app-reminders>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  remindersTypes = REMINDERS_TYPE;
  activeTab = null;
  events = [];
  reminders = [];
  appointments = [];
  constructor(private appointmentsService: AppointmentsService, private eventsService: EventsService) {}

  async ionViewWillEnter() {
    this.setAppointments();
    this.setNextEvents();
  }

  async setAppointments() {
    this.appointments = await this.appointmentsService.getAppointmentsByUser();
    this.changeReminders(this.remindersTypes.appointments);
  }
  async setNextEvents() {
    const events = await this.eventsService.getNextEvents();
    this.events = [
      ...events.map((a) => ({
        title: 'Dr.' + a.professional.lastName,
        subtitle: '',
        date: a.date,
        type: 'appointment',
      })),
    ];
  }

  changeReminders(value) {
    this.activeTab = value;
    switch (value) {
      case this.remindersTypes.appointments:
        this.reminders = this.appointments;
        break;
      case this.remindersTypes.medications:
        this.reminders = [];
        break;
      case this.remindersTypes.documents:
        this.reminders = [];
        break;
    }
  }
}
