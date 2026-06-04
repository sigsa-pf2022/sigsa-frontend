import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GroupsService } from 'src/app/views/groups/shared/services/groups/groups.service';

@Component({
  selector: 'app-menu',
  template: `
    <ion-menu [contentId]="this.contentId" [swipeGesture]="true" mode="md">
      <ion-header class="app-menu__header" mode="md">
        <ion-toolbar class="app-menu__toolbar" mode="md">
          <p class="app-menu__eyebrow">Acciones</p>
          <h2 class="app-menu__title">{{ this.title }}</h2>
        </ion-toolbar>
      </ion-header>
      <ion-content class="app-menu__content">
        <div class="app-menu__list">
          <ion-item
            class="app-menu__item"
            lines="none"
            *ngFor="let option of this.options"
            (click)="onOptionClick(option)"
            [button]="true"
            detail="false"
          >
            <div
              class="app-menu__icon"
              [class.app-menu__icon--danger]="option.color === 'danger'"
              aria-hidden="true"
            >
              <ion-icon
                *ngIf="getIconPath(option)"
                [src]="getIconPath(option)"
              ></ion-icon>
              <ion-icon
                *ngIf="!getIconPath(option) && getIonicIcon(option)"
                [name]="getIonicIcon(option)"
              ></ion-icon>
            </div>
            <span
              class="app-menu__label"
              [class.app-menu__label--danger]="option.color === 'danger'"
            >
              {{ option.title }}
            </span>
            <ion-icon name="chevron-forward" class="app-menu__chevron" aria-hidden="true"></ion-icon>
          </ion-item>
        </div>
      </ion-content>
    </ion-menu>
  `,
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() contentId: string;
  @Input() title: string;
  @Input() options: any;

  constructor(
    private alertController: AlertController,
    private groupsService: GroupsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async onOptionClick(option: any) {
    switch (option.action) {
      case 'see-members':
        if (option.groupId) {
          await this.navController.navigateForward([`/groups/${option.groupId}/members`]);
        }
        break;
      case 'exit-group':
        await this.confirmExitGroup(option.groupId, option.memberId);
        break;
      default:
        break;
    }
  }

  async confirmExitGroup(groupId: string, memberId: string) {
    const alert = await this.alertController.create({
      header: 'Abandonar grupo',
      message: '¿Está seguro que desea abandonar el grupo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: async () => {
            try {
              await this.groupsService.deleteMember(groupId, memberId);
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Has abandonado el grupo correctamente.',
                buttons: [
                  {
                    text: 'OK',
                    handler: async () => {
                      await this.navController.navigateRoot(['/tabs/groups']);
                    },
                  },
                ],
              });
              await successAlert.present();
            } catch (error) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Ocurrió un error al abandonar el grupo.',
                buttons: ['OK'],
              });
              await errorAlert.present();
              console.error('Error al abandonar el grupo', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  getIconPath(option: any): string | null {
    // Si el ícono termina en .svg, es un archivo
    if (option.icon && option.icon.endsWith('.svg')) {
      return `/assets/images/reminders/${option.icon}`;
    }
    return null;
  }

  getIonicIcon(option: any): string | null {
    // Si el ícono NO termina en .svg, es un ícono de Ionic
    if (option.icon && !option.icon.endsWith('.svg')) {
      return option.icon;
    }
    return null;
  }
}
