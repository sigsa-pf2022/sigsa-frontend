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
  selector: 'app-meds-event-item-list',
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
        [class.list-item__icon--med]="!dueDate"
        [class.list-item__icon--due]="dueDate"
        aria-hidden="true"
      >
        <ion-icon name="medkit"></ion-icon>
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
        <span class="list-item__meta" *ngIf="this.treatmentMeta">{{ this.treatmentMeta }}</span>
        <span class="list-item__taken" *ngIf="this.takenChargeBy">
          <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
          {{ this.takenChargeBy }} se hizo cargo
        </span>
      </div>
    </ion-item>
  `,
  styleUrls: ['./meds-event-item-list.component.scss'],
})
export class MedsEventsItemListComponent implements OnInit, OnChanges {
  @Input() medEvent;
  @Input() flush: boolean = false;
  title: string;
  subtitle: string;
  treatmentMeta: string;
  takenChargeBy: string;
  dueDate: boolean;
  status: EventStatus;
  statusBadgeClass = '';
  constructor(private dateFormatterService: DateFormatterService) {}
  ngOnInit() {
    this.setMedEventData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medEvent']) {
      this.setMedEventData();
    }
  }

  /** Nombre de quien se hizo cargo, si alguien lo hizo. */
  private resolveTakenCharge(event: any): string {
    const by = event?.takenChargeBy;
    return by ? `${by.firstName ?? ''} ${by.lastName ?? ''}`.trim() : '';
  }

  setMedEventData() {
    if (!this.medEvent) {
      this.title = 'Medicamento';
      this.subtitle = '';
      this.treatmentMeta = '';
      this.takenChargeBy = '';
      this.status = null;
      this.dueDate = false;
      this.statusBadgeClass = '';
      return;
    }

    // El input puede ser una toma suelta o un tratamiento agrupado
    // (varias tomas del mismo medicamento). En el segundo caso mostramos la
    // próxima toma pendiente, o la última si ya terminó.
    const isTreatment = this.medEvent.totalDoses > 1;
    const reference = isTreatment
      ? this.medEvent.nextDose ?? this.medEvent.doses?.[this.medEvent.doses.length - 1] ?? {}
      : this.medEvent;

    if (isTreatment) {
      const doseNumber = this.medEvent.nextDose
        ? this.medEvent.nextDose.doseIndex
        : this.medEvent.totalDoses;
      this.treatmentMeta =
        `Cada ${this.medEvent.intervalHours} hs · toma ${doseNumber} de ${this.medEvent.totalDoses}`;
    } else {
      this.treatmentMeta = '';
    }

    // En un tratamiento, el aviso corresponde a la toma que se está mostrando.
    this.takenChargeBy = this.resolveTakenCharge(reference);

    const med = this.medEvent.med || {};
    const rawName = med.name;
    const name = typeof rawName === 'string' ? rawName.trim() : rawName != null ? String(rawName) : '';
    const rawDosage = med.dosage;
    const dosageStr = rawDosage == null ? '' : typeof rawDosage === 'string' ? rawDosage.trim() : String(rawDosage);
    this.title = `${name}${dosageStr ? ' ' + dosageStr : ''}`.trim() || 'Medicamento';

    let formattedDate = '';
    try {
      if (reference.date) {
        formattedDate = this.dateFormatterService.getSpanishFormattedDate(reference.date);
      }
    } catch {
      formattedDate = '';
    }
    this.subtitle = formattedDate;

    this.status = EVENT_STATUS.find((es) => es.value === reference.status);
    this.statusBadgeClass = this.status ? (STATUS_BADGE_CLASS[this.status.color] || '') : '';
    if (this.status && this.status.value === EventStatusEnum.CONFIRMADO && reference.date) {
      const date = new Date(reference.date);
      this.dueDate = !isNaN(date.getTime()) && isBefore(date, new Date());
    } else {
      this.dueDate = false;
    }
  }
}
