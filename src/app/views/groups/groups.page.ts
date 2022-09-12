import { Component, OnInit } from '@angular/core';
import { FamilyGroup } from './interfaces/familyGroup';
import { GroupsService } from './services/groups.service';

@Component({
  selector: 'app-groups',
  template: `
    <ion-content class="g">
      <ion-title class="g__title">{{'tabs.groups.title' | translate}}</ion-title>
      <ion-item *ngFor="let group of groups" lines="none" class="g__item marco">
        <div class="g__item__wrap">
          <ion-avatar slot="start" class="g__item__wrap__avatar">
            <img
              src="https://lapaginamillonaria.com/__export/1661275731372/sites/lpm/img/2022/08/23/julian_alvarez_tema.jpg_1055622710.jpg"
            />
          </ion-avatar>
          <div class="g__item__wrap__description">
            <ion-label class="g__item__wrap__description__title titulo">{{ group.name }}</ion-label>
            <ion-label class="g__item__wrap__description__subtitle subtitulo">{{ group.members.length }}</ion-label>
          </div>
          <ion-icon name="chevron-forward-outline" class="g__item__wrap__icon"></ion-icon>
        </div>
      </ion-item>
    </ion-content>
  `,
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  groups: FamilyGroup[];
  constructor(private groupsService: GroupsService) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    await this.groupsService
      .getFamilyGroupsByUserId('fIgMDiWRLBf9loIyIzGEvnK3zQ52')
      .then((res: FamilyGroup[]) => (this.groups = res));
  }
}
