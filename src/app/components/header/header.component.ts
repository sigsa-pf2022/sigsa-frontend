import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  template: `
    <ion-header class="ui-background__primary">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-button (click)="navigateToProfile()">
            <ion-icon src="./assets/images/home/personal-profile.svg"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon name="notifications"></ion-icon>
          </ion-button>
        </ion-buttons>
        <div class="toolbar-content">
          <ion-icon src="./assets/images/logos/logo-white.svg"></ion-icon>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private navController: NavController, private auth: AuthenticationService) {}

  ngOnInit() {}

  navigateToProfile() {
    return this.navController.navigateRoot(['profile']);
  }
}
