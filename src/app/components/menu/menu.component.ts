import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GroupsService } from 'src/app/views/groups/shared/services/groups/groups.service';

@Component({
  selector: 'app-menu',
  template: ` <ion-menu [contentId]="this.contentId" [swipeGesture]="true">
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-title>{{ this.title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item
        class="mi"
        lines="none"
        *ngFor="let option of this.options"
        (click)="onOptionClick(option)"
      >
        <div class="mi__wrapper">
          <div class="mi__wrapper__title">
            <ion-icon 
              color="primary" 
              [src]="getIconPath(option)"
              *ngIf="getIconPath(option)"
            ></ion-icon>
            <ion-icon 
              color="primary" 
              [name]="getIonicIcon(option)"
              *ngIf="!getIconPath(option) && getIonicIcon(option)"
            ></ion-icon>
            <ion-title class="ui-font-profile-title">{{ option.title }}</ion-title>
          </div>
        </div>
      </ion-item>
    </ion-content>
  </ion-menu>`,
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
