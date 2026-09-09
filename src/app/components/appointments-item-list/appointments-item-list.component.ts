import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { isBefore } from 'date-fns';
import { EventStatus, EVENT_STATUS, EventStatusEnum } from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { titleCase } from 'src/app/utils/title-case';

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
        <span class="list-item__taken" *ngIf="this.takenChargeBy">
          <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
          {{ this.takenChargeBy }} se hizo cargo
        </span>
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
  takenChargeBy: string;
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

  /** Nombre de quien se hizo cargo, si alguien lo hizo. */
  private resolveTakenCharge(event: any): string {
    const by = event?.takenChargeBy;
    return by ? titleCase(`${by.firstName ?? ''} ${by.lastName ?? ''}`) : '';
  }

  setProfessionalData() {
    if (!this.appointment) {
      this.title = 'Turno';
      this.subtitle = '';
      this.takenChargeBy = '';
      this.status = null;
      this.dueDate = false;
      this.statusBadgeClass = '';
      return;
    }

    this.takenChargeBy = this.resolveTakenCharge(this.appointment);

    const professional = this.appointment.professional;
    const firstName = professional?.firstName?.trim();
    const lastName = professional?.lastName?.trim();
    const hasProfessionalNames = Boolean(firstName || lastName);
    // El prefijo queda como está; sólo se capitaliza el nombre.
    this.title = hasProfessionalNames
      ? `Dr/a ${titleCase(`${firstName || ''} ${lastName || ''}`)}`.trim()
      : 'Turno sin profesional';

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
