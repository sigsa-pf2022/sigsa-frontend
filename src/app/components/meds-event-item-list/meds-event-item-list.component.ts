import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { isBefore } from 'date-fns';
import { EventStatus, EVENT_STATUS, EventStatusEnum } from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

@Component({
  selector: 'app-meds-event-item-list',
  template: `
  <ion-item class="il" [ngClass]="{ 'il-due': dueDate, 'il--flush': flush }" lines="none">
      <div class="il__img">
        <ion-img [src]="'assets/images/reminders/pill.svg'"></ion-img>
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
  styleUrls: ['./meds-event-item-list.component.scss'],
})
export class MedsEventsItemListComponent implements OnInit, OnChanges {
  @Input() medEvent;
  @Input() flush: boolean = false; // Quita margen horizontal cuando true
  title: string;
  subtitle: string;
  dueDate: boolean;
  status: EventStatus;
  constructor(private dateFormatterService: DateFormatterService) {}
  ngOnInit() {
    this.setMedEventData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medEvent']) {
      this.setMedEventData();
    }
  }

  setMedEventData() {
    if (!this.medEvent) {
      this.title = 'Medicamento';
      this.subtitle = '';
      this.status = null;
      this.dueDate = false;
      return;
    }

    const med = this.medEvent.med || {};
    const rawName = med.name;
    const name = typeof rawName === 'string' ? rawName.trim() : rawName != null ? String(rawName) : '';
    const rawDosage = med.dosage;
    const dosageStr = rawDosage == null ? '' : typeof rawDosage === 'string' ? rawDosage.trim() : String(rawDosage);
    this.title = `${name}${dosageStr ? ' ' + dosageStr : ''}`.trim() || 'Medicamento';

    // Fecha segura
    let formattedDate = '';
    try {
      if (this.medEvent.date) {
        formattedDate = this.dateFormatterService.getSpanishFormattedDate(this.medEvent.date);
      }
    } catch {
      formattedDate = '';
    }
    this.subtitle = formattedDate;

    this.status = EVENT_STATUS.find((es) => es.value === this.medEvent.status);
    if (this.status && this.status.value === EventStatusEnum.CONFIRMADO && this.medEvent.date) {
      const date = new Date(this.medEvent.date);
      this.dueDate = !isNaN(date.getTime()) && isBefore(date, new Date());
    } else {
      this.dueDate = false;
    }
  }
}
