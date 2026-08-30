import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { GroupsService } from '../shared/services/groups/groups.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-group-members',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goToGroupHome()"
            aria-label="Volver"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Grupo familiar</p>
        <h1 class="listing-header__title">Miembros</h1>
      </header>

      <app-loading-state *ngIf="isLoading" [rows]="4"></app-loading-state>

      <div class="gm__scroll" *ngIf="!isLoading">
        <ion-item
          *ngFor="let member of members"
          class="member-row"
          lines="none"
        >
          <div class="member-row__avatar">
            <app-avatar
              [photo]="member.photo"
              [name]="member.firstName + ' ' + member.lastName"
            ></app-avatar>
          </div>
          <div class="member-row__body">
            <span class="member-row__name">{{ member.firstName | titlecase }} {{ member.lastName | titlecase }}</span>
            <span class="member-row__sub" *ngIf="isAdmin(member.id)">Administrador</span>
          </div>
          <button
            type="button"
            class="member-row__action member-row__action--danger"
            *ngIf="member.id != loggedUserId"
            (click)="deleteMember(member.id)"
            aria-label="Eliminar miembro"
          >
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </ion-item>
      </div>

      <ion-fab class="app-fab gm__fab" vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button
          class="app-fab-button"
          (click)="navigateToAddMember()"
          aria-label="Agregar miembro"
        >
          <ion-icon name="person-add"></ion-icon>
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
  isLoading = true;

  constructor(
    private groupsService: GroupsService,
    private navController: NavController,
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
    // Antes usábamos un LoadingController con duration: 2000, que se
    // auto-cerraba a los 2s aunque la request siguiera en vuelo. Ahora el
    // skeleton vive y muere con la request.
    this.isLoading = !this.members?.length;
    try {
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
    } catch (error) {
      console.error('GroupMembersPage: error cargando miembros', error);
    } finally {
      this.isLoading = false;
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

  getInitials(member: any): string {
    const first = (member?.firstName ?? '').trim();
    const last = (member?.lastName ?? '').trim();
    return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
  }
}
