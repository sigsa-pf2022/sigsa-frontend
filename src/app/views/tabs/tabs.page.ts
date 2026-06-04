import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-tabs',
  template: `
    <app-header></app-header>
    <ion-content>
      <ion-tabs>
        <ion-tab-bar slot="bottom" class="app-tabbar">
          <ion-tab-button tab="home" aria-label="Inicio">
            <ion-icon class="tab-icon tab-icon--outline" name="home-outline"></ion-icon>
            <ion-icon class="tab-icon tab-icon--filled" name="home"></ion-icon>
            <ion-label>Inicio</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="appointments" aria-label="Turnos">
            <ion-icon class="tab-icon tab-icon--outline" name="calendar-outline"></ion-icon>
            <ion-icon class="tab-icon tab-icon--filled" name="calendar"></ion-icon>
            <ion-label>Turnos</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="clipboard" aria-label="Documentos">
            <ion-icon class="tab-icon tab-icon--outline" name="document-text-outline"></ion-icon>
            <ion-icon class="tab-icon tab-icon--filled" name="document-text"></ion-icon>
            <ion-label>Documentos</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="groups" aria-label="Grupos">
            <ion-icon class="tab-icon tab-icon--outline" name="people-outline"></ion-icon>
            <ion-icon class="tab-icon tab-icon--filled" name="people"></ion-icon>
            <ion-label>Grupos</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="meds" aria-label="Medicamentos">
            <ion-icon class="tab-icon tab-icon--outline" name="medkit-outline"></ion-icon>
            <ion-icon class="tab-icon tab-icon--filled" name="medkit"></ion-icon>
            <ion-label>Medicación</ion-label>
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
