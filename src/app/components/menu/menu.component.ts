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
      <div *ngFor="let option of this.options">
        <ion-icon color="primary" [src]="'/assets/images/reminders/' + option.icon"></ion-icon>
        <ion-label [color]="option.color" (click)="onOptionClick(option)">
            {{ option.title }}
          </ion-label>
      </div>
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
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.navController.navigateRoot(['/tabs/groups']).then(() => {
                      window.location.reload();
                    });
                  }
                }],
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
}