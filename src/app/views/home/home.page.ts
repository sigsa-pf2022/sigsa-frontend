import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import {
  AvailableResult,
  BiometryType,
  NativeBiometric,
} from 'capacitor-native-biometric';

@Component({
  selector: 'app-home',
  template: `
    <ion-content class="home">
      <div class="home__logo">
        <ion-img class="ui-logo__small" src="/assets/images/logos/logo-with-title.png"></ion-img>
      </div>
      <ion-img
        class="home__welcome_img"
        src="/assets/images/home/doctor.svg"
      ></ion-img>
      <div class="home__buttons">
        <ion-button class="ui-button" mode="md" (click)="goToLogin()">
          {{ 'home.login' | translate }}
        </ion-button>
        <ion-button
          class="ui-button ui-button-outlined"
          mode="md"
          (click)="goToRegister()"
        >
          {{ 'home.register' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private navController: NavController,
    public platform: Platform
  ) {}

  ngOnInit() {}

  goToRegister() {
    this.navController.navigateForward('/register');
  }

  goToLogin() {
    this.navController.navigateForward('/login');
    // this.biometricLogin();
    // try {
    // } catch (error) {
    //   console.log(error);
    // }
  }

  biometricLogin() {
    NativeBiometric.isAvailable().then(
      (result: AvailableResult) => {
        const isAvailable = result.isAvailable;
        if (isAvailable) {
          // Get user's credentials
          // Authenticate using biometrics before logging the user in
          NativeBiometric.verifyIdentity({
            reason: 'For easy log in',
            title: 'Log in',
            subtitle: 'Maybe add subtitle here?',
            description: 'Maybe a description too?',
          }).then(
            (res) => {
              this.navController.navigateForward('/login');
              // Authentication successful
              // this.login(credentials.username, credentials.password);
            },
            (error) => {
              // Failed to authenticate
            }
          );
        }
      },
      (error) => {
        // Couldn't check availability
      }
    );
  }
}
