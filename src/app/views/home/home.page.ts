import { Component, OnInit } from '@angular/core';
import { isBefore } from 'date-fns';
import { EventsService } from 'src/app/services/events/events.service';
import { AppointmentsService } from '../appointments/shared/services/appointments/appointments.service';
import { REMINDERS_TYPE } from './constants/remindersType';
import { FAKE_APPOINTMENTS_REMINDERS_DATA } from './fakes/fakeAppointmentsReminderData';
import { FAKE_DOCUMENTS_REMINDERS_DATA } from './fakes/fakeDocumentsReminderData';
import { FAKE_MEDICATIONS_REMINDERS_DATA } from './fakes/fakeMedicationsReminderData';

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
    this.setData();
  }

  async setData() {
    this.appointments = await this.appointmentsService.getAppointmentsByUser();
    const nextAppointments = this.appointments.filter((a) => isBefore(a.createdAt, new Date()));
    this.events = [
      ...nextAppointments.map((a) => ({
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
