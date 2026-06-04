import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GroupsService } from './shared/services/groups/groups.service';
import { FamilyGroup } from './shared/interfaces/family-group.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groups',
  template: `
    <ion-content class="listing groups">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Tu familia</p>
        <h1 class="listing-header__title">Mis grupos</h1>
      </header>

      <ng-container *ngIf="this.groups.length > 0; else emptyState">
        <div class="groups__scroll">
          <app-group-item
            *ngFor="let group of this.groups"
            [group]="group"
            (click)="goToGroupHome(group.id)"
          ></app-group-item>
        </div>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state" role="status" *ngIf="!isInitialLoad">
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="people"></ion-icon>
          </div>
          <h2 class="empty-state__title">Sin grupos todavía</h2>
          <p class="empty-state__subtitle">
            Creá un grupo familiar para gestionar la salud de quienes dependen de vos.
          </p>
          <button type="button" class="empty-state__cta" (click)="navigateTo()">
            <ion-icon name="add"></ion-icon>
            Crear grupo
          </button>
        </div>
      </ng-template>

      <ion-fab class="app-fab" vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button
          class="app-fab-button"
          (click)="navigateTo()"
          aria-label="Crear grupo"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {
  groups: FamilyGroup[] = [];
  isInitialLoad = true;
  private paramsSubscription: Subscription;

  constructor(
    private groupsService: GroupsService,
    private navController: NavController,
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
  }

  ionViewWillEnter() {
    this.getGroups();
  }

  goToGroupHome(groupId: string) {
    return this.navController.navigateForward([`/groups/home/${groupId}`]);
  }

  async getGroups() {
    try {
      this.groups = await this.groupsService.getFamilyGroupsByUser();
    } catch (error) {
      console.error('GroupsPage: error loading groups', error);
    } finally {
      this.isInitialLoad = false;
    }
  }

  navigateTo() {
    this.navController.navigateRoot(['/groups/create']);
  }
}
