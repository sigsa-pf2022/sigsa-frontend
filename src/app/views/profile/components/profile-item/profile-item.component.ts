import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile-item',
  template: `
    <div class="profile-item">
      <ion-item
        class="option-row"
        lines="none"
        [button]="!!this.action"
        detail="false"
        (click)="emitAction()"
      >
        <div class="option-row__icon" aria-hidden="true">
          <ng-container *ngIf="this.profileIcon">
            <ion-icon [src]="'/assets/images/' + this.profileIcon"></ion-icon>
          </ng-container>
          <ng-container *ngIf="!this.profileIcon">
            <ion-icon [name]="this.icon"></ion-icon>
          </ng-container>
        </div>
        <div class="option-row__body">
          <span class="option-row__title">{{ title }}</span>
        </div>
        <ion-toggle
          *ngIf="this.icon === 'settings-outline'"
          class="option-row__toggle"
          (click)="$event.stopPropagation()"
        ></ion-toggle>
        <ion-icon
          *ngIf="this.action && this.icon !== 'settings-outline'"
          name="chevron-forward"
          class="option-row__chevron"
          aria-hidden="true"
        ></ion-icon>
      </ion-item>

      <div class="option-sub" *ngIf="this.content?.length && this.icon !== 'settings-outline'">
        <div class="option-sub__item" *ngFor="let contentItem of this.content">
          <span>{{ contentItem.title }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() title: string;
  @Input() profileIcon: string;
  @Input() icon: string;
  @Input() action: any;
  @Input() content: any[];
  @Output() doAction = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
  }

  emitAction(){
    if (!this.action) return;
    return this.doAction.emit(this.action);
  }
}
