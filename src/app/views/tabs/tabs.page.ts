import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  template: `
    <app-header></app-header>
    <ion-content>
      <ion-tabs>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home">
            <ion-icon name="home"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="appointment">
            <ion-icon name="calendar-number"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="clipboard">
            <ion-icon name="clipboard"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="groups">
            <ion-icon name="people"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="meds">
            <ion-icon name="medkit"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  `,
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(
  ) {}

  ngOnInit() {}
}
