import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PROFILE_OPTIONS } from './constants/profile-options';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goBack()"
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
        <p class="listing-header__eyebrow">Tu cuenta</p>
        <h1 class="listing-header__title">Mi perfil</h1>
      </header>

      <article
        class="profile-hero profile-hero--tappable"
        *ngIf="user"
        role="button"
        tabindex="0"
        aria-label="Editar mis datos"
        (click)="goToMyData()"
        (keyup.enter)="goToMyData()"
      >
        <div class="profile-hero__avatar" aria-hidden="true">
          {{ getInitials(user) }}
        </div>
        <div class="profile-hero__body">
          <p class="profile-hero__name">
            {{ user.firstName }} {{ user.lastName }}
          </p>
          <p class="profile-hero__email" *ngIf="user.email">{{ user.email }}</p>
          <span class="profile-hero__chip" *ngIf="user.role === 'professional'">Profesional</span>
        </div>
        <ion-icon class="profile-hero__chevron" name="chevron-forward" aria-hidden="true"></ion-icon>
      </article>

      <div class="p__sections">
        <p class="section-eyebrow">Salud</p>
        <app-profile-item
          *ngFor="let option of options"
          [title]="option.title"
          [icon]="option.icon"
          [profileIcon]="option.profileIcon"
          [content]="option.content"
          [action]="option.action"
          (doAction)="this.doAction($event)"
        ></app-profile-item>

        <button type="button" class="p__logout" (click)="logout()">
          <span class="option-row__icon option-row__icon--danger" aria-hidden="true">
            <ion-icon name="log-out-outline"></ion-icon>
          </span>
          <span class="option-row__title option-row__title--danger">Cerrar sesión</span>
        </button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  options = [];
  user: any;
  constructor(private auth: AuthenticationService, private navController: NavController) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.buildOptions();
  }

  goBack() {
    this.navController.navigateBack(['/tabs/home']);
  }

  goToMyData() {
    return this.navController.navigateForward(['/profile/mis-datos']);
  }

  logout() {
    this.auth.signOut();
    return this.navController.navigateRoot(['welcome']);
  }

  buildOptions() {
    this.user = this.auth.user();
    // Cargar las opciones omitiendo la primera (que era el placeholder del nombre,
    // ahora reemplazado por el profile-hero)
    const all = JSON.parse(JSON.stringify(PROFILE_OPTIONS));
    this.options = all.slice(1);

    if (this.user.role === 'professional') {
      // Replace "Mis Profesionales" with "Mis Pacientes"
      this.options[0] = {
        icon: 'people-outline',
        title: 'Mis Pacientes',
        action: {
          type: 'navigate',
          payload: '/patients',
        },
      };
    }
  }

  getInitials(user: any): string {
    const first = (user?.firstName ?? '').trim();
    const last = (user?.lastName ?? '').trim();
    return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
  }

  doAction(event) {
    if (event.type === 'navigate') {
      this.navController.navigateForward([event.payload]);
    }
  }
}
