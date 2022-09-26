import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { EventCardComponent } from './event-card/event-card.component';
import { NextEventsComponent } from './next-events/next-events.component';
import { RemindersComponent } from './reminders/reminders.component';

@NgModule({
  declarations: [NextEventsComponent, EventCardComponent, RemindersComponent],
  imports: [CommonModule, IonicModule, SwiperModule],
  exports: [NextEventsComponent, EventCardComponent,RemindersComponent],
})
export class SharedComponentsHomeModule {}
