import { Component, Input, OnInit } from '@angular/core';
import { NextEvent } from 'src/app/views/home/shared/interfaces/next-event';

@Component({
  selector: 'app-event-card',
  template: `
    <div class="ec" [ngClass]="event.type === 'medication' ? 'ec-medication' : 'ec-appointment'" [attr.aria-label]="event.title" role="group">
      <div
        class="ec__date"
        [ngClass]="event.type === 'medication' ? 'ec-medication__date' : 'ec-appointment__date'"
      >
  <ion-label class="ec__date__calendar">{{ event.date | date: 'dd/MM' }}</ion-label>
  <ion-label class="ec__date__day">{{ dayShortEs }}</ion-label>
      </div>
      <div class="ec__description">
        <ion-label class="ec__description__hour">{{ event.date | date: 'HH:mm' }}</ion-label>
        <ion-label class="ec__description__med">{{ event.title }}</ion-label>
        <ion-label class="ec__description__dosis">{{ event.subtitle }}</ion-label>
      </div>
      <div class="ec__options" role="button" tabindex="0" aria-label="Opciones evento">
        <ion-icon name="options-outline" aria-hidden="true"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: NextEvent;
  dayShortEs = '';
  constructor() {}

  ngOnInit() {
    if (this.event?.date) {
      // Obtener abreviación en español (lun, mar, mié, etc.)
      this.dayShortEs = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
        .format(new Date(this.event.date))
        .replace('.', '') // algunos navegadores añaden punto
        .toLowerCase();
    }
  }
}
