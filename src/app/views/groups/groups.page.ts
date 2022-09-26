import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { FamilyGroup } from './interfaces/familyGroup';
import { GroupsService } from './services/groups.service';

@Component({
  selector: 'app-groups',
  template: `
    <ion-content class="g">
      <div class="g__content">
        <ion-label class="g__content__title">{{
          'tabs.groups.title' | translate
        }}</ion-label>
        <ion-item
          *ngFor="let group of groups"
          lines="none"
          class="g__content__item"
        >
          <div class="g__content__item__wrap">
            <ion-avatar slot="start" class="g__content__item__wrap__avatar">
              <ion-img [src]="group.imgUrl"></ion-img>
            </ion-avatar>
            <div class="g__content__item__wrap__description">
              <ion-label
                class="g__content__item__wrap__description__title titulo"
                >{{ group.name }}</ion-label
              >
              <ion-label
                class="g__content__item__wrap__description__subtitle subtitulo"
                >{{ group.members.length }} miembros</ion-label
              >
            </div>
            <ion-icon
              name="chevron-forward-outline"
              class="g__content__item__wrap__icon"
            ></ion-icon>
          </div>
        </ion-item>
      </div>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="navigateTo()" class="g__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  groups: FamilyGroup[];
  constructor(
    private groupsService: GroupsService,
    private navController: NavController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getGroups();
  }

  async getGroups() {
    if (!this.groups) {
      await this.showLoading();
      await this.groupsService
        .getFamilyGroupsByUserId('fIgMDiWRLBf9loIyIzGEvnK3zQ52')
        .then(async (res: FamilyGroup[]) => {
          for (const fg of res) {
            console.log(fg);
            fg.imgUrl = URL.createObjectURL(
              await this.groupsService.getGroupImage(fg.imgUrl)
            );
          }
          this.groups = res;
        });
      this.closeLoading();
    }
  }
  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent',
      cssClass: 'ui-loading',
    });
    loading.present();
  }

  closeLoading() {
    this.loadingController.dismiss();
  }

  navigateTo() {
    this.navController.navigateForward(['/new-group']);
  }
}
