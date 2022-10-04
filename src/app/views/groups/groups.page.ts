import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FamilyGroup } from './interfaces/FamilyGroup';
import { GroupsService } from './services/groups.service';

@Component({
  selector: 'app-groups',
  template: `
    <ion-content class="g" *ngIf="this.groups">
      <div class="g__content">
        <ion-label class="g__content__title">{{
          'tabs.groups.title' | translate
        }}</ion-label>
        <app-group-item
          *ngFor="let group of this.groups"
          [group]="group"
          (click)="goToGroupHome(group.id)"
        ></app-group-item>
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
    private loadingController: LoadingController,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getGroups();
  }
  goToGroupHome(groupId: string) {
    return this.navController.navigateForward([`/groups-home/${groupId}`]);
  }

  async getGroups() {
    if (!this.groups) {
      await this.showLoading();
      await this.groupsService
        .getFamilyGroupsByUserId(this.authService.user().uid)
        .then(async (res: FamilyGroup[]) => {
          console.log(res);
          if (res) {
            for (const fg of res) {
              fg.imgUrl = URL.createObjectURL(
                await this.groupsService.getGroupImage(fg.imgUrl)
              );
            }
            this.groups = res;
          }
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
    this.navController.navigateRoot(['/new-group']);
  }
}
