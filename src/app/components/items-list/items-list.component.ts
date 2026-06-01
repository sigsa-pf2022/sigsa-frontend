import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
export class ItemsListComponent implements OnInit, OnChanges {
  @Input() img: string;
  @Input() fallbackIcon = 'cube-outline';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() showIcon = true;
  @Input() isSelectable = false;
  @Input() value: any;
  @Input() selectedValue: any;

  /**
   * Pre-computed selected flag. We avoid a getter binding to dodge any
   * Angular change-detection edge case where the getter could return
   * stale or unexpected values. Recalculated on every input change.
   */
  isItemSelected = false;

  constructor() {}

  ngOnInit() {
    this.recomputeSelection();
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.recomputeSelection();
  }

  private recomputeSelection(): void {
    if (this.isSelectable !== true) {
      this.isItemSelected = false;
      return;
    }
    const v = this.value;
    const sv = this.selectedValue;
    if (v === null || v === undefined) {
      this.isItemSelected = false;
      return;
    }
    if (sv === null || sv === undefined) {
      this.isItemSelected = false;
      return;
    }
    this.isItemSelected = sv === v;
  }
}
