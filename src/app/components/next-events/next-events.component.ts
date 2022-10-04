import { Component, Input, OnInit } from '@angular/core';
import { NextEvent } from 'src/app/views/home/interfaces/next-event';
import SwiperCore, { Autoplay, Navigation, SwiperOptions } from 'swiper';
SwiperCore.use([Autoplay, Navigation]);
@Component({
  selector: 'app-next-events',
  template: `
    <div class="ne">
      <ion-label>Proximos eventos</ion-label>
      <swiper class="ne__swiper" [config]="this.swiperConfig">
        <ng-template
          *ngFor="let event of this.events"
          swiperSlide
          class="ne__swiper__slide"
        >
          <app-event-card [event]="this.event"></app-event-card>
        </ng-template>
      </swiper>
    </div>
  `,
  styleUrls: ['./next-events.component.scss'],
})
export class NextEventsComponent implements OnInit {
  @Input() events: NextEvent[];
  swiperConfig: SwiperOptions = {
    spaceBetween: -40,
    height: 120,
    centeredSlides: false,
    autoplay: true,
  };
  constructor() {}

  ngOnInit() {}
}
