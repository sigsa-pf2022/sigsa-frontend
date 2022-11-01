import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selectable-items-list',
  template: `<ion-list class="il" [ngStyle]="{ 'min-height': this.height }">
    <ion-radio-group (ionChange)="changeDoctor($event)">
      <ion-item *ngFor="let item of this.items" class="il__item" lines="full">
        <div class="il__item__img">
          <ion-img
            [src]="'assets/images/reminders/' + item.img + '.svg'"
          ></ion-img>
        </div>
        <div class="il__item__content">
          <ion-label>{{ item.title }}</ion-label>
          <ion-label
            class="il__item__content__subtitle"
            *ngIf="item.subtitle"
            >{{ item.subtitle }}</ion-label
          >
        </div>
        <ion-radio class="il__item__action" [value]="item"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>`,
  styleUrls: ['./selectable-items-list.component.scss'],
})
export class SelectableItemsListComponent implements OnInit {
  @Input() height = '350px';
  @Input() items;
  @Output() selectDoctor = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  changeDoctor(event) {
    return this.selectDoctor.emit(event.detail.value);
  }
}
