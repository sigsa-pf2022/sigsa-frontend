import { Component, Input, OnInit } from '@angular/core';
import { Professional } from '../../interfaces/Professional.interface';

@Component({
  selector: 'app-doctors-list',
  template: `
    <div class="dl" [ngStyle]="{ 'min-height': this.height }">
      <ion-item
        *ngFor="let doctor of this.doctors"
        class="list-item"
        lines="none"
        [button]="true"
        detail="false"
      >
        <div class="list-item__icon list-item__icon--med" aria-hidden="true">
          <ion-icon name="medkit"></ion-icon>
        </div>
        <div class="list-item__body">
          <span class="list-item__title">Dr/a {{ doctor.firstName | titlecase }} {{ doctor.lastName | titlecase }}</span>
        </div>
        <ion-icon name="chevron-forward" class="dl__chevron" aria-hidden="true"></ion-icon>
      </ion-item>
    </div>
  `,
  styleUrls: ['./doctors-list.component.scss'],
})
export class DoctorsListComponent implements OnInit {
  @Input() height = '350px';
  @Input() doctors: Professional[];
  constructor() {}

  ngOnInit() {}
}
