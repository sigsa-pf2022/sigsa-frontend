import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  template: `
    <ion-header class="app-header" mode="md">
      <ion-toolbar class="app-header__toolbar" mode="md">
        <ion-buttons slot="start">
          <button
            type="button"
            class="app-header__avatar"
            (click)="navigateToProfile()"
            aria-label="Perfil"
          >
            <ion-icon
              class="app-header__avatar-icon"
              src="./assets/images/home/personal-profile.svg"
            ></ion-icon>
          </button>
        </ion-buttons>

        <div class="app-header__brand">
          <ion-icon
            class="app-header__brand-icon"
            src="./assets/images/logos/logo.svg"
            aria-label="SIGSA"
          ></ion-icon>
        </div>

        <ion-buttons slot="end">
          <!-- Notifications bell intentionally removed until the
               notifications page is implemented. -->
        </ion-buttons>
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
