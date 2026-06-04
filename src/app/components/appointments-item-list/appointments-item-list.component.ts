import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { isBefore } from 'date-fns';
import { EventStatus, EVENT_STATUS, EventStatusEnum } from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

const STATUS_BADGE_CLASS = {
  danger: 'status-badge--danger',
  primary: 'status-badge--violet',
  success: 'status-badge--success',
  warning: 'status-badge--warning',
  info: 'status-badge--info',
};

@Component({
  selector: 'app-appointments-item-list',
  template: `
    <ion-item
      class="list-item"
      [class.list-item--due]="dueDate"
      lines="none"
      [button]="true"
      detail="false"
    >
      <div
        class="list-item__icon"
        [class.list-item__icon--appointment]="!dueDate"
        [class.list-item__icon--due]="dueDate"
        aria-hidden="true"
      >
        <ion-icon name="calendar"></ion-icon>
      </div>
      <div class="list-item__body">
        <div class="list-item__row">
          <span class="list-item__title">{{ this.title }}</span>
          <span
            *ngIf="this.status"
            class="status-badge"
            [ngClass]="statusBadgeClass"
          >
            {{ this.status.text }}
          </span>
        </div>
        <span class="list-item__subtitle">{{ this.subtitle }}</span>
      </div>
    </ion-item>
  `,
  styleUrls: ['./appointments-item-list.component.scss'],
})
export class AppointmentsItemListComponent implements OnInit, OnChanges {
  @Input() appointment;
  @Input() flush: boolean = false; // Quita margen horizontal cuando true
  title: string;
  subtitle: string;
  dueDate: boolean;
  status: EventStatus;
  statusBadgeClass = '';
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
      this.statusBadgeClass = '';
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
    this.statusBadgeClass = this.status ? (STATUS_BADGE_CLASS[this.status.color] || '') : '';
    if (this.status && this.status.value === EventStatusEnum.CONFIRMADO) {
      const date = new Date(this.appointment.date);
      this.dueDate = isBefore(date, new Date());
    } else {
      this.dueDate = false;
    }
  }
}
