import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { GroupsService } from './shared/services/groups/groups.service';
import { FamilyGroup } from './shared/interfaces/family-group.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groups',
  template: `
    <ion-content class="g">
      <div class="g__content">
        <ion-label class="g__content__title"> Mis Grupos</ion-label>
        <ng-container *ngIf="this.groups.length > 0">
          <app-group-item
            *ngFor="let group of this.groups"
            [group]="group"
            (click)="goToGroupHome(group.id)"
          ></app-group-item>
        </ng-container>

        <ng-container *ngIf="this.groups.length === 0">
          <img src="/assets/images/groups/groups-empty.svg" />
          <ion-label class="g__content__empty-title"
            >Todavia no perteneces a ningun grupo. ¡Aprovechá para crear el tuyo!</ion-label
          >
        </ng-container>
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
export class GroupsPage implements OnInit, OnDestroy {
  groups: FamilyGroup[] = [];
  private paramsSubscription: Subscription;
  private isLoading: boolean = false;

  constructor(
    private groupsService: GroupsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.getGroups();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.closeLoading();

  }

  ionViewWillEnter() {
    this.getGroups();
  }

  goToGroupHome(groupId: string) {
    return this.navController.navigateForward([`/groups/home/${groupId}`]);
  }

  async getGroups() {
    try {
      if (!this.isLoading) {
        await this.showLoading();
      }
      this.groups = await this.groupsService.getFamilyGroupsByUser();
    } catch (error) {
      console.error('GroupsPage: error loading groups', error);
    } finally {
      await this.closeLoading();
    }
  }

  async showLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent',
      cssClass: 'ui-loading',
    });
    await loading.present();
  }

  async closeLoading() {
    this.isLoading = false;
    const loading = await this.loadingController.getTop();
    if (loading) {
      await loading.dismiss();
    }
  }

  navigateTo() {
    this.navController.navigateRoot(['/groups/create']);
  }
}
