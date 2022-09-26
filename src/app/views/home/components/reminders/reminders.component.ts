import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { REMINDERS_TYPE } from '../../constants/remindersType';

@Component({
  selector: 'app-reminders',
  template: ` <div class="rem">
    <ion-segment
      class="rem__segment"
      (ionChange)="segmentChanged($event)"
      [value]="remindersTypes.medications"
    >
      <ion-segment-button
        class="rem__segment__button"
        [value]="remindersTypes.medications"
      >
        <ion-label>Medicamentos</ion-label>
      </ion-segment-button>
      <ion-segment-button
        class="rem__segment__button"
        [value]="remindersTypes.appointments"
      >
        <ion-label>Turnos</ion-label>
      </ion-segment-button>
      <ion-segment-button
        class="rem__segment__button"
        [value]="remindersTypes.documents"
      >
        <ion-label>Documentos</ion-label>
      </ion-segment-button>
    </ion-segment>
    <ion-list class="rem__list">
      <ion-item
        *ngFor="let reminder of this.reminders"
        class="rem__list__item"
        lines="full"
      >
        <div class="rem__list__item__img">
          <ion-img
            [src]="'assets/images/reminders/' + reminder.type + '.svg'"
          ></ion-img>
        </div>
        <div class="rem__list__item__description">
          <ion-label>{{ reminder.title }}</ion-label>
          <ion-label *ngIf="reminder.dosis">{{
            'Proxima ingesta: ' + reminder.nextIngestion
          }}</ion-label>
        </div>
        <ion-icon class="rem__list__item__action" name="chevron-forward-outline" color="primary"></ion-icon>
      </ion-item>
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
