import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups',
  template: ` 
  <ion-content>
    <ion-title class="fuente">Mis Grupos</ion-title>
    <ion-item lines="none" class="marco">
      <div class="div">
      <ion-avatar slot="start" class="foto">
        <img src="https://lapaginamillonaria.com/__export/1661275731372/sites/lpm/img/2022/08/23/julian_alvarez_tema.jpg_1055622710.jpg" />
      </ion-avatar>
      <div>
        <ion-title class="titulo">Juliancito</ion-title>
        <ion-label class="subtitulo">4 usuarios</ion-label>
      </div>
      <ion-icon name="chevron-forward-outline" class="icon"></ion-icon>
      </div>
    </ion-item>
    <ion-item class="marco">
      <ion-avatar slot="start" class="foto">
        <img src="https://lapaginamillonaria.com/__export/1661275731372/sites/lpm/img/2022/08/23/julian_alvarez_tema.jpg_1055622710.jpg" />
      </ion-avatar>
      <ion-label>
        <ion-title class="titulo">Juliancito</ion-title>
        <ion-label class="subtitulo">4 usuarios</ion-label>
        <ion-icon name="chevron-forward-outline" class="icon"></ion-icon>
      </ion-label>
    </ion-item>
    <ion-item class="marco">
      <ion-avatar slot="start" class="foto">
        <img src="https://lapaginamillonaria.com/__export/1661275731372/sites/lpm/img/2022/08/23/julian_alvarez_tema.jpg_1055622710.jpg" />
      </ion-avatar>
      <ion-label>
        <ion-title class="titulo">Juliancito</ion-title>
        <ion-label class="subtitulo">4 usuarios</ion-label>
        <ion-icon name="chevron-forward-outline" class="icon"></ion-icon>
      </ion-label>
    </ion-item>
  </ion-content> 
  `,
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
