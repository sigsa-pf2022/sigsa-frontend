import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { REMINDERS_TYPE } from 'src/app/views/home/constants/remindersType';

@Component({
  selector: 'app-reminders',
  template: `
    <div class="rem">
      <ion-segment class="rem__segment" (ionChange)="changeReminders($event)" [value]="remindersTypes.medications">
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
    </div>
    <cdk-virtual-scroll-viewport *ngIf="activeTab !== remindersTypes.appointments" itemSize="3">
      <app-items-list
        *cdkVirtualFor="let reminder of this.reminders"
        [title]="reminder.title"
        [subtitle]="reminder.subtitle"
        [img]="reminder.img"
      ></app-items-list>
    </cdk-virtual-scroll-viewport>
    <cdk-virtual-scroll-viewport *ngIf="activeTab === remindersTypes.appointments" itemSize="3">
      <app-appointments-item-list
        *cdkVirtualFor="let appointment of this.reminders"
        [appointment]="appointment"
      ></app-appointments-item-list>
    </cdk-virtual-scroll-viewport>
  `,
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements OnChanges {
  @Input() reminders;
  @Input() activeTab = REMINDERS_TYPE.medications;
  @Output() tabChanged = new EventEmitter<string>();
  remindersTypes = REMINDERS_TYPE;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.reminders = changes.reminders.currentValue;
  }

  changeReminders(event) {
    this.activeTab = event.detail.value;
    this.tabChanged.emit(event.detail.value);
  }

}
