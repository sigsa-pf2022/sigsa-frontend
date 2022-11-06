import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile-item',
  template: `
    <ion-item class="pi" lines="none" (click)="emitAction()">
      <div class="pi__wrapper">
        <div class="pi__wrapper__title">
          <ng-container *ngIf="this.profileIcon">
            <ion-icon [src]="'/assets/images/' + this.profileIcon"></ion-icon>
          </ng-container>
          <ng-container *ngIf="!this.profileIcon">
            <ion-icon color="medium" class="profile-icon" slot="start" [name]="this.icon"></ion-icon>
          </ng-container>
          <ion-title class="ui-font-profile-title">{{ title }}</ion-title>
        </div>
        <div
          *ngIf="this.content"
          [ngClass]="this.icon === 'settings-outline' ? 'pi__wrapper__data-toggle' : 'pi__wrapper__data'"
        >
          <ion-label *ngFor="let contentItem of this.content" class=".ui-font-profile-label"
            >{{ contentItem.title }}
          </ion-label>
          <ion-toggle *ngIf="this.icon === 'settings-outline'"></ion-toggle>
        </div>
      </div>
    </ion-item>
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

  ngOnInit() {}

  emitAction(){
    return this.doAction.emit(this.action);
  }
}
