import { Component, Input, OnInit } from '@angular/core';
import { NextEvent } from 'src/app/views/home/shared/interfaces/next-event';

@Component({
  selector: 'app-event-card',
  template: `
    <div class="ec" [ngClass]="event.type.title === 'medication' ? 'ec-medication' : 'ec-appointment'">
      <div
        class="ec__date"
        [ngClass]="event.type.title === 'medication' ? 'ec-medication__date' : 'ec-appointment__date'"
      >
        <ion-label class="ec__date__calendar">{{ event.date | date: 'dd/MM' }}</ion-label>
        <ion-label class="ec__date__day">{{ event.date | date: 'EEE' }}</ion-label>
      </div>
      <div class="ec__description">
        <ion-label class="ec__description__hour">{{ this.event.date | date: 'HH:mm' }}</ion-label>
        <ion-label class="ec__description__med">{{ event.title }}</ion-label>
        <ion-label class="ec__description__dosis">{{ event.subtitle }}</ion-label>
      </div>
      <div class="ec__options">
        <ion-icon name="options-outline"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: NextEvent;
  constructor() {}

  ngOnInit() {}
}
