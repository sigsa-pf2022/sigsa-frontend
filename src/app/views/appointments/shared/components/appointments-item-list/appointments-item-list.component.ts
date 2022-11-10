import { Component, Input, OnInit } from '@angular/core';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

@Component({
  selector: 'app-appointments-item-list',
  template: ` <ion-item class="il" lines="full">
    <div class="il__img">
      <ion-img [src]="'assets/images/reminders/doctor.svg'"></ion-img>
    </div>
    <div class="il__content">
      <ion-label>{{ this.title }}</ion-label>
      <ion-label class="il__content__subtitle">{{ this.subtitle }}</ion-label>
    </div>
  </ion-item>`,
  styleUrls: ['./appointments-item-list.component.scss'],
})
export class AppointmentsItemListComponent implements OnInit {
  @Input() appointment;
  title: string;
  subtitle: string;
  constructor(private dateFormatterService: DateFormatterService) {}
  ngOnInit() {
    this.setProfessionalData();
  }

  setProfessionalData() {
    this.title = `Dr/a ${this.appointment.professional.firstName} ${this.appointment.professional.lastName}`;
    this.subtitle = this.dateFormatterService.getSpanishFormattedDate(this.appointment.date);
  }
}
