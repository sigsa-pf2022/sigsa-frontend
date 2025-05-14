import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AnimationController, LoadingController, NavController } from '@ionic/angular';
import { GroupsService } from '../shared/services/groups/groups.service';

@Component({
  selector: 'app-group-members',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Miembros del grupo</ion-title>
        <ion-list>
          <ion-item *ngFor="let member of members">
            <ion-label>{{ member.name }}</ion-label>
            <ion-button color="danger" (click)="deleteMember(member.id)"> Eliminar </ion-button>
          </ion-item>
        </ion-list>
      </ion-toolbar>
    </ion-header>
    <ion-content class="gh"> </ion-content>
  `,
  styleUrls: ['./group-members.page.scss'],
})
export class GroupMembersPage implements OnInit {
  groupId: string;
  members: any;

  constructor(
    private groupsService: GroupsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  ionViewWillEnter() {
    // this.getMembers();
  }
  goToGroupHome(groupId: string) {
    return this.navController.navigateForward([`/groups/home/${groupId}`]);
  }
  async getMembers() {
    await this.showLoading();
    this.members = await this.groupsService.getMembers(this.groupId);
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
}
