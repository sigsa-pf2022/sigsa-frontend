import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { GroupsService } from '../shared/services/groups/groups.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-group-members',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="goToGroupHome()"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Miembros del grupo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="gh">
      <ion-list>
        <ion-item *ngFor="let member of members">
          <ion-label>
            {{ member.firstName }} {{ member.lastName }}
            <span *ngIf="isAdmin(member.id)" style="font-size: 12px; color: var(--ion-color-medium)"> (Admin)</span>
          </ion-label>
          <ion-button color="danger" *ngIf="member.id != loggedUserId" (click)="deleteMember(member.id)">
            Eliminar
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="navigateToAddMember()" class="gm__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./group-members.page.scss'],
})
export class GroupMembersPage implements OnInit {
  groupId: string;
  members: any;
  loggedUserId: any;
  adminId: string;

  constructor(
    private groupsService: GroupsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.loggedUserId = this.auth.user().id;
  }

  ionViewWillEnter() {
    this.getMembers();
  }
  goToGroupHome() {
    return this.navController.navigateForward([`/groups/home/${this.groupId}`]);
  }
  async getMembers() {
    await this.showLoading();
    const group = await this.groupsService.getFamilyGroupById(this.groupId);
    this.members = group.members;
    this.adminId = group.createdBy;

    // Ordenar: admin primero, luego alfabéticamente
    this.members.sort((a, b) => {
      const aIsAdmin = a.id === this.adminId;
      const bIsAdmin = b.id === this.adminId;
      
      if (aIsAdmin && !bIsAdmin) return -1;
      if (!aIsAdmin && bIsAdmin) return 1;
      
      // Ambos no-admin: ordenar alfabéticamente
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });

    this.closeLoading();
  }
  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 2000,
    });
    await loading.present();
  }
  async closeLoading() {
    const loading = await this.loadingController.getTop();
    if (loading) {
      await loading.dismiss();
    }
  }
  async deleteMember(memberId: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar miembro',
      message: '¿Está seguro que desea eliminar miembro?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: async () => {
            try {
              await this.groupsService.deleteMember(this.groupId, memberId);
              this.getMembers();
            } catch (error) {
              console.error('Error eliminar miembro:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }
  navigateToAddMember() {
    this.navController.navigateForward([`/groups/add-members`], {
      queryParams: { groupId: this.groupId },
    });
  }

  isAdmin(memberId: string): boolean {
    return this.adminId === memberId;
  }
}
