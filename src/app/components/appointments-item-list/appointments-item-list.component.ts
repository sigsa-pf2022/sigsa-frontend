import { Component, Input, OnInit } from '@angular/core';
import { EventStatus, EVENT_STATUS } from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

@Component({
  selector: 'app-appointments-item-list',
  template: `
    <ion-item class="il" lines="full">
      <div class="il__img">
        <ion-img [src]="'assets/images/reminders/doctor.svg'"></ion-img>
      </div>
      <div class="il__content">
        <div class="il__content__title">
          <ion-text>{{ this.title }}</ion-text>
          <ion-text [color]="this.status?.color" class="il__content__title__status">{{ this.status?.text }}</ion-text>
        </div>
        <ion-text class="il__content__subtitle">{{ this.subtitle }}</ion-text>
      </div>
    </ion-item>
  `,
  styleUrls: ['./appointments-item-list.component.scss'],
})
export class AppointmentsItemListComponent implements OnInit {
  @Input() appointment;
  title: string;
  subtitle: string;
  status: EventStatus;
  constructor(private dateFormatterService: DateFormatterService) {}
  ngOnInit() {
    this.setProfessionalData();
  }

  setProfessionalData() {
    this.title = `Dr/a ${this.appointment.professional.firstName} ${this.appointment.professional.lastName}`;
    this.subtitle = this.dateFormatterService.getSpanishFormattedDate(this.appointment.date);
    this.status = EVENT_STATUS.find((es) => es.value === this.appointment.status);
  }
}
