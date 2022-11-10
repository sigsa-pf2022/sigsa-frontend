import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-event-card',
  template: ` <div class="eec">
    <div class="eec__description">
      <ion-label class="eec__description__title">No hay proximos eventos</ion-label>
    </div>
  </div>`,
  styleUrls: ['./empty-event-card.component.scss'],
})
export class EmptyEventCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
