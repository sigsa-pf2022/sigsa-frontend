import { Component, Input, OnInit } from '@angular/core';
import { Professional } from '../../interfaces/Professional.interface';

@Component({
  selector: 'app-doctors-list',
  template: `
    <ion-list class="dl" [ngStyle]="{ 'min-height': this.height }">
      <ion-item *ngFor="let doctor of this.doctors" class="dl__item" lines="full">
        <div class="dl__item__img">
          <ion-img [src]="'assets/images/reminders/doctor.svg'"></ion-img>
        </div>
        <div class="dl__item__content">
          <ion-label>{{ doctor.firstName }} {{ doctor.lastName }}</ion-label>
          <ion-label class="dl__item__content__subtitle">{{ doctor.field }}</ion-label>
        </div>
        <ion-icon class="dl__item__action" name="chevron-forward-outline" color="primary"></ion-icon>
      </ion-item>
    </ion-list>
  `,
  styleUrls: ['./doctors-list.component.scss'],
})
export class DoctorsListComponent implements OnInit {
  @Input() height = '350px';
  @Input() doctors: Professional[];
  constructor() {}

  ngOnInit() {}
}
