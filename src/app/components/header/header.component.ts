import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
            <app-avatar
              [photo]="user?.photo"
              [name]="fullName"
              icon="person"
            ></app-avatar>
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
export class HeaderComponent implements OnInit, OnDestroy {
  user: any;
  private sub?: Subscription;

  constructor(private navController: NavController, private auth: AuthenticationService) {}

  ngOnInit() {
    // El header vive en el shell de tabs y no se recrea al navegar, así que
    // se escucha al servicio para que la foto nueva aparezca al volver de
    // "Mis datos".
    this.sub = this.auth.user$.subscribe((user) => (this.user = user));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get fullName(): string {
    if (!this.user) return '';
    return `${this.user.firstName ?? ''} ${this.user.lastName ?? ''}`.trim();
  }

  navigateToProfile() {
    return this.navController.navigateRoot(['profile']);
  }
}
