import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  EventStatus,
  isPastEvent,
  resolveEventStatus,
  STATUS_BADGE_CLASS,
} from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { actorName } from 'src/app/utils/event-actor';
import { formatMedTitle } from 'src/app/utils/med-dosage';
import { titleCase } from 'src/app/utils/title-case';

@Component({
  selector: 'app-meds-event-item-list',
  template: `
    <ion-item class="list-item" lines="none" [button]="true" detail="false">
      <div
        class="list-item__icon"
        [class.list-item__icon--med]="!isPast"
        [class.list-item__icon--past]="isPast"
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
        <span
          class="list-item__taken list-item__taken--canceled"
          *ngIf="this.canceledBy; else takenChargeLine"
        >
          <ion-icon name="close-circle" aria-hidden="true"></ion-icon>
          {{ this.canceledBy }} canceló
        </span>
        <ng-template #takenChargeLine>
          <span class="list-item__taken" *ngIf="this.takenChargeBy">
            <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
            {{ this.takenChargeBy }} se hizo cargo
          </span>
        </ng-template>
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
  canceledBy: string;
  isPast: boolean;
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
    return actorName(event?.takenChargeBy);
  }

  /** Nombre de quien lo canceló. Manda sobre el anterior: es el estado actual. */
  private resolveCanceledBy(event: any): string {
    return actorName(event?.canceledBy);
  }

  setMedEventData() {
    if (!this.medEvent) {
      this.title = 'Medicamento';
      this.subtitle = '';
      this.treatmentMeta = '';
      this.takenChargeBy = '';
      this.canceledBy = '';
      this.status = null;
      this.isPast = false;
      this.statusBadgeClass = '';
      return;
    }

    // El input puede ser una toma suelta o un tratamiento agrupado (varias
    // tomas del mismo medicamento). En el tratamiento mostramos la próxima toma
    // pendiente, o la última si ya terminó.
    //
    // Ojo con la toma única: el endpoint de tratamientos también la devuelve
    // envuelta (totalDoses: 1 y la toma en `doses[0]`), y el envoltorio no
    // tiene `date` ni `status`. Sin desenvolverlo, esas filas quedaban sin
    // fecha y sin estado. Mismo criterio que usa el action sheet del grupo.
    const isTreatment = this.medEvent.totalDoses > 1;
    const reference = isTreatment
      ? this.medEvent.nextDose ?? this.medEvent.doses?.[this.medEvent.doses.length - 1] ?? {}
      : this.medEvent.doses?.[0] ?? this.medEvent;

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
    this.canceledBy = this.resolveCanceledBy(reference);

    this.title = formatMedTitle(this.medEvent.med) || 'Medicamento';

    let formattedDate = '';
    try {
      if (reference.date) {
        formattedDate = this.dateFormatterService.getSpanishFormattedDate(reference.date);
      }
    } catch {
      formattedDate = '';
    }
    this.subtitle = formattedDate;

    this.status = resolveEventStatus(reference);
    this.statusBadgeClass = this.status ? STATUS_BADGE_CLASS[this.status.color] : '';
    this.isPast = isPastEvent(reference);
  }
}
