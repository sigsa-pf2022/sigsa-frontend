import { Component, OnInit } from '@angular/core';
import { REMINDERS_TYPE } from './constants/remindersType';
import { FAKE_APPOINTMENTS_REMINDERS_DATA } from './fakes/fakeAppointmentsReminderData';
import { FAKE_DOCUMENTS_REMINDERS_DATA } from './fakes/fakeDocumentsReminderData';
import { FAKE_EVENTS_DATA } from './fakes/fakeEventsData';
import { FAKE_MEDICATIONS_REMINDERS_DATA } from './fakes/fakeMedicationsReminderData';

@Component({
  selector: 'app-home',
  template: `
    <ion-content class="home">
      <app-next-events [events]="this.events"></app-next-events>
      <app-reminders
        [reminders]="this.reminders"
        (changeReminders)="changeReminders($event)"
      ></app-reminders>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  events = [];
  reminders = [];
  constructor() {}

  ngOnInit() {}

  changeReminders(value: string) {
    switch (value) {
      case REMINDERS_TYPE.appointments:
        this.reminders = FAKE_APPOINTMENTS_REMINDERS_DATA;
        break;
      case REMINDERS_TYPE.medications:
        this.reminders = FAKE_MEDICATIONS_REMINDERS_DATA;
        break;
      case REMINDERS_TYPE.documents:
        this.reminders = FAKE_DOCUMENTS_REMINDERS_DATA;
        break;
    }
  }
}
