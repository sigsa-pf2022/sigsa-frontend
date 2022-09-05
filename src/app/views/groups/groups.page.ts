import { Component, OnInit } from '@angular/core';
import { GroupsService } from './services/groups.service';

@Component({
  selector: 'app-groups',
  template: ` 
  <ion-content>
    <ion-title class="fuente">Mis Grupos</ion-title>
    <div *ngFor="let group of this.groups;">
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
    </div>
   
  </ion-content> 
  `,
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  groups=[];
  constructor(private groupsService: GroupsService) { }

  ngOnInit() { }
  ionViewWillEnter() {
   //this.groupsService.getFamilyGroupsByUserId('fIgMDiWRLBf9loIyIzGEvnK3zQ52').subscribe(res => this.groups = res);
  }
}
