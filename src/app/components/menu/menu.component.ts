import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  template: `<ion-menu [contentId]="this.contentId">
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">This is the menu content.</ion-content>
  </ion-menu>`,
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() contentId: string;
  constructor() {}

  ngOnInit() {}
}
