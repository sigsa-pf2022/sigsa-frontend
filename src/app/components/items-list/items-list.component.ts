import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-list',
  template: `
    <ion-list class="il" [ngStyle]="{ 'min-height': this.height }">
      <ion-item *ngFor="let item of this.items" class="il__item" lines="full">
        <div class="il__item__img">
          <ion-img
            [src]="'assets/images/reminders/' + item.img + '.svg'"
          ></ion-img>
        </div>
        <div class="il__item__content">
          <ion-label>{{ item.title }}</ion-label>
          <ion-label class="il__item__content__subtitle" *ngIf="item.subtitle">{{ item.subtitle }}</ion-label>
        </div>
        <ion-icon
          class="il__item__action"
          name="chevron-forward-outline"
          color="primary"
        ></ion-icon>
      </ion-item>
    </ion-list>
  `,
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  @Input() height = '350px';
  @Input() items;
  constructor() {}

  ngOnInit() {}
}
