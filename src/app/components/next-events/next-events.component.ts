import { Component, Input, OnInit } from '@angular/core';
import { NextEvent } from 'src/app/views/home/shared/interfaces/next-event';
import SwiperCore, { Autoplay, Navigation, SwiperOptions } from 'swiper';
SwiperCore.use([Autoplay, Navigation]);
@Component({
  selector: 'app-next-events',
  template: `
    <div class="ne">
      <div class="ne__swiper__wrapper">
        <swiper class="ne__swiper" [config]="swiperConfig" (swiper)="onSwiper($event)">
          <ng-template *ngFor="let event of this.events" swiperSlide class="ne__swiper__slide">
            <app-event-card [event]="event" (next)="goNext()"></app-event-card>
          </ng-template>
          <ng-template
            *ngIf="!this.loading && this.events.length === 0"
            swiperSlide
            class="ne__swiper__slide"
          >
            <app-empty-event-card></app-empty-event-card>
          </ng-template>
          <ng-template *ngIf="this.loading" swiperSlide class="ne__swiper__slide">
            <div class="ne__skeleton">
              <ion-skeleton-text class="ne__skeleton__line ne__skeleton__line--eyebrow" [animated]="true"></ion-skeleton-text>
              <ion-skeleton-text class="ne__skeleton__line ne__skeleton__line--title" [animated]="true"></ion-skeleton-text>
              <ion-skeleton-text class="ne__skeleton__line ne__skeleton__line--sub" [animated]="true"></ion-skeleton-text>
            </div>
          </ng-template>
        </swiper>
        <div class="ne__hint" *ngIf="events && events.length > 1">
          <div class="ne__hint__gradient"></div>
          <ion-icon name="chevron-forward-outline" class="ne__hint__icon" aria-hidden="true"></ion-icon>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./next-events.component.scss'],
})
export class NextEventsComponent implements OnInit {
  @Input() events: NextEvent[];
  /** Mientras la página trae los datos mostramos una card skeleton en vez de la vacía. */
  @Input() loading = false;
  private swiperRef: any;
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 12,
    centeredSlides: false,
    autoplay: { delay: 5000, disableOnInteraction: false },
    speed: 500,
    resistanceRatio: 0.85,
  };
  constructor() {}

  ngOnInit() {}

  onSwiper(swiper: any) {
    this.swiperRef = swiper;
  }

  /** Avanza a la siguiente card (alternativa al arrastre). */
  goNext() {
    this.swiperRef?.slideNext();
  }
}
