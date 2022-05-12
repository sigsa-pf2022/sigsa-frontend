import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button color="primary" (click)="goToRegister()">
        Registrarse
      </ion-button>
      <ion-button color="secondary" (click)="goToLogin()">
        Iniciar sesion
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToRegister() {
    this.navController.navigateForward('/register');
  }

  goToLogin() {
    this.navController.navigateForward('/login');
  }
}
