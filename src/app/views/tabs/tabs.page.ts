import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<ion-header class="ui-background__primary">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-button>
            <ion-icon
              src="./assets/images/home/personal-profile.svg"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon name="notifications"></ion-icon>
          </ion-button>
        </ion-buttons>
        <div class="toolbar-content">
          <ion-icon src="./assets/images/logos/logo-white.svg"></ion-icon>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-tabs>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home">
            <ion-icon name="home"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="calendar">
            <ion-icon name="calendar"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="clipboard">
            <ion-icon name="clipboard"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="people">
            <ion-icon name="people"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="meds">
            <ion-icon name="medkit"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content> `,
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
