import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  template: ` <ion-menu [contentId]="this.contentId" [swipeGesture]="true">
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-title>{{ this.title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div *ngFor="let option of this.options">
        <ion-icon color="primary" [src]="'/assets/images/reminders/' + option.icon"></ion-icon>
        <ion-label [color]="option.color">{{ option.title }}</ion-label>
      </div>
    </ion-content>
  </ion-menu>`,
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() contentId: string;
  @Input() title: string;
  @Input() options: any;
  constructor() {}

  ngOnInit() {}
}
