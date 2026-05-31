import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-event-card',
  template: `<div class="eec" role="status" aria-live="polite">
    <div class="eec__icon" aria-hidden="true">
      <ion-icon [name]="icon"></ion-icon>
    </div>
    <div class="eec__description">
      <ion-label class="eec__description__title">{{ title }}</ion-label>
      <ion-label *ngIf="subtitle" class="eec__description__subtitle">{{ subtitle }}</ion-label>
    </div>
  </div>`,
  styleUrls: ['./empty-event-card.component.scss'],
})
export class EmptyEventCardComponent implements OnInit {
  @Input() title = 'No hay próximos eventos';
  @Input() subtitle = 'Cuando agregues un turno o medicamento, va a aparecer acá.';
  @Input() icon = 'sparkles-outline';

  constructor() {}

  ngOnInit() {}
}
