import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { REMINDERS_TYPE } from 'src/app/views/home/constants/remindersType';

@Component({
  selector: 'app-reminders',
  template: ` <div class="rem">
    <ion-segment class="rem__segment" (ionChange)="segmentChanged($event)" [value]="remindersTypes.medications">
      <ion-segment-button class="rem__segment__button" [value]="remindersTypes.medications">
        <ion-label>Medicamentos</ion-label>
      </ion-segment-button>
      <ion-segment-button class="rem__segment__button" [value]="remindersTypes.appointments">
        <ion-label>Turnos</ion-label>
      </ion-segment-button>
      <ion-segment-button class="rem__segment__button" [value]="remindersTypes.documents">
        <ion-label>Documentos</ion-label>
      </ion-segment-button>
    </ion-segment>
    <ion-list>
      <app-items-list
        *ngFor="let reminder of this.reminders"
        [title]="reminder.title"
        [subtitle]="reminder.subtitle"
        [img]="reminder.img"
      ></app-items-list>
    </ion-list>
  </div>`,
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements OnInit {
  @Input() reminders;
  @Output() changeReminders = new EventEmitter<string>();
  remindersTypes = REMINDERS_TYPE;
  activeSegment: string;
  constructor() {}

  ngOnInit() {}

  segmentChanged($event) {
    this.activeSegment = $event.detail.value;
    this.changeReminders.emit(this.activeSegment);
  }
}
