import { Component, Input, OnInit } from '@angular/core';
import { EventStatus, EVENT_STATUS } from 'src/app/constants/EventStatus.constant';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

@Component({
  selector: 'app-meds-event-item-list',
  template: `
    <ion-item class="il" lines="full">
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
export class MedsEventsItemListComponent implements OnInit {
  @Input() medEvent;
  title: string;
  subtitle: string;
  status: EventStatus;
  constructor(private dateFormatterService: DateFormatterService) {}
  ngOnInit() {
    this.setProfessionalData();
  }

  setProfessionalData() {
    console.log(this.medEvent);
    this.title = `${this.medEvent.med.name} ${this.medEvent.med.dosage}`;
    this.subtitle = this.dateFormatterService.getSpanishFormattedDate(this.medEvent.date);
    this.status = EVENT_STATUS.find((es) => es.value === this.medEvent.status);
  }
}
