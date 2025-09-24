import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { isBefore } from 'date-fns';
import { EventStatus, EVENT_STATUS, EventStatusEnum } from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

@Component({
  selector: 'app-appointments-item-list',
  template: `
  <ion-item class="ail" [ngClass]="{ 'ail-due': dueDate }" lines="none">
      <div class="ail__img">
        <ion-img [src]="'assets/images/reminders/doctor.svg'"></ion-img>
      </div>
      <div class="ail__content">
        <div class="ail__content__title">
          <ion-text>{{ this.title }}</ion-text>
          <ion-text [color]="this.status?.color" class="ail__content__title__status">{{ this.status?.text }}</ion-text>
        </div>
        <ion-text class="ail__content__subtitle">{{ this.subtitle }}</ion-text>
      </div>
    </ion-item>
  `,
  styleUrls: ['./appointments-item-list.component.scss'],
})
export class AppointmentsItemListComponent implements OnInit, OnChanges {
  @Input() appointment;
  title: string;
  subtitle: string;
  dueDate: boolean;
  status: EventStatus;
  constructor(private dateFormatterService: DateFormatterService) {}
  ngOnInit() {
    this.setProfessionalData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appointment']) {
      this.setProfessionalData();
    }
  }

  setProfessionalData() {
    if (!this.appointment) {
      this.title = 'Turno';
      this.subtitle = '';
      this.status = null;
      this.dueDate = false;
      return;
    }

    const professional = this.appointment.professional;
    const firstName = professional?.firstName?.trim();
    const lastName = professional?.lastName?.trim();
    const hasProfessionalNames = Boolean(firstName || lastName);
    this.title = hasProfessionalNames ? `Dr/a ${firstName || ''} ${lastName || ''}`.trim() : 'Turno sin profesional';

    try {
      this.subtitle = this.dateFormatterService.getSpanishFormattedDate(this.appointment.date);
    } catch {
      this.subtitle = '';
    }

    this.status = EVENT_STATUS.find((es) => es.value === this.appointment.status);
    if (this.status && this.status.value === EventStatusEnum.CONFIRMADO) {
      const date = new Date(this.appointment.date);
      this.dueDate = isBefore(date, new Date());
    } else {
      this.dueDate = false;
    }
  }
}
