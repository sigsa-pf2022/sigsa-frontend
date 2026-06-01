import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-list',
  template: `
    <ion-item
      class="picker-card"
      [class.picker-card--selected]="isItemSelected"
      lines="none"
      [button]="true"
      detail="false"
    >
      <div class="picker-card__icon" aria-hidden="true">
        <ion-img *ngIf="img" [src]="'assets/images/reminders/' + img + '.svg'"></ion-img>
        <ion-icon *ngIf="!img && fallbackIcon" [name]="fallbackIcon"></ion-icon>
      </div>
      <div class="picker-card__body">
        <span class="picker-card__title">{{ title }}</span>
        <span class="picker-card__subtitle" *ngIf="subtitle">{{ subtitle }}</span>
      </div>
      <ion-icon
        *ngIf="showIcon && !isSelectable"
        class="picker-card__chevron"
        name="chevron-forward"
        aria-hidden="true"
      ></ion-icon>
      <div *ngIf="isSelectable" class="picker-card__radio" aria-hidden="true"></div>
    </ion-item>
  `,
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  @Input() img: string;
  @Input() fallbackIcon = 'cube-outline';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() showIcon = true;
  @Input() isSelectable = false;
  @Input() value: any;
  @Input() selectedValue: any;
  constructor() {}

  ngOnInit() {}

  /**
   * Selection only fires when the card is in selectable mode AND we
   * have a real (non-nullish) value AND a real selectedValue AND they
   * strictly match. This prevents the legacy issue where two undefined
   * inputs collapsed to "all selected" because undefined === undefined.
   */
  get isItemSelected(): boolean {
    if (!this.isSelectable) return false;
    if (this.value === null || this.value === undefined) return false;
    if (this.selectedValue === null || this.selectedValue === undefined) return false;
    return this.selectedValue === this.value;
  }
}
