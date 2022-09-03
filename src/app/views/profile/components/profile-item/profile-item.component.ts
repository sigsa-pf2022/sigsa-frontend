import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-item',
  template: `
    <ion-item class="pi" lines="none">
      <div class="pi__wrapper">
        <div class="pi__wrapper__title">
          <ion-icon
            color="medium"
            class="profile-icon"
            slot="start"
            [name]="this.icon"
          ></ion-icon>
          <ion-title class="ui-font-profile-title">{{ title }}</ion-title>
        </div>
        <div *ngIf="this.content" [ngClass]="this.icon === 'settings-outline'?'pi__wrapper__data-toggle':'pi__wrapper__data'">
          <ion-label
            *ngFor="let contentItem of this.content"
            class=".ui-font-profile-label"
            >{{ contentItem.title }} </ion-label>
          <ion-toggle *ngIf="this.icon === 'settings-outline'"></ion-toggle>
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() title: string;
  @Input() icon: string;
  @Input() content: any[];

  constructor() {}

  ngOnInit() {}
}
