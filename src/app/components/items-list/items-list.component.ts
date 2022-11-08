import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-list',
  template: `
    <ion-item class="il" lines="full">
      <div class="il__img">
        <ion-img [src]="'assets/images/reminders/' + img + '.svg'"></ion-img>
      </div>
      <div class="il__content">
        <ion-label>{{ title }}</ion-label>
        <ion-label class="il__content__subtitle" *ngIf="subtitle">{{ subtitle }}</ion-label>
      </div>
      <ion-icon *ngIf="this.showIcon" class="il__action" name="chevron-forward-outline" color="primary"></ion-icon>
      <ion-radio *ngIf="this.isSelectable" slot="end" [value]="this.value"></ion-radio>
    </ion-item>
  `,
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  @Input() img: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() showIcon = true;
  @Input() isSelectable = false;
  @Input() value;
  constructor() {}

  ngOnInit() {}
}
