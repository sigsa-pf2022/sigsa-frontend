import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NextEvent } from 'src/app/views/home/shared/interfaces/next-event';

@Component({
  selector: 'app-event-card',
  template: `
    <div
      class="ec"
      [ngClass]="event.type === 'medication' ? 'ec--medication' : 'ec--appointment'"
      [attr.aria-label]="event.title"
      role="group"
    >
      <div class="ec__icon" aria-hidden="true">
        <ion-icon [name]="event.type === 'medication' ? 'medkit' : 'calendar'"></ion-icon>
      </div>

      <div class="ec__body">
        <div class="ec__meta">
          <span class="ec__date">{{ event.date | date: 'dd MMM' }}</span>
          <span class="ec__dot">·</span>
          <span class="ec__hour">{{ event.date | date: 'HH:mm' }}</span>
        </div>
        <p class="ec__title">{{ event.title }}</p>
        <p class="ec__subtitle" *ngIf="event.subtitle">{{ event.subtitle }}</p>
      </div>

      <button
        type="button"
        class="ec__chevron"
        aria-label="Ver siguiente"
        (click)="onNext($event)"
      >
        <ion-icon name="chevron-forward"></ion-icon>
      </button>
    </div>
  `,
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: NextEvent;
  @Output() next = new EventEmitter<void>();
  dayShortEs = '';
  constructor() {}

  onNext(ev: Event) {
    // No dejar que el tap se propague al arrastre/click de la card.
    ev.stopPropagation();
    ev.preventDefault();
    this.next.emit();
  }

  ngOnInit() {
    if (this.event?.date) {
      this.dayShortEs = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
        .format(new Date(this.event.date))
        .replace('.', '')
        .toLowerCase();
    }
  }
}
