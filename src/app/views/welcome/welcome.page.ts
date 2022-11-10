import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AvailableResult, BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { PlatformService } from 'src/app/services/platform/platform.service';

@Component({
  selector: 'app-welcome',
  template: `
    <ion-content class="welcome">
      <div class="welcome__logo">
        <ion-img class="ui-logo__small" src="/assets/images/logos/logo-with-title.png"></ion-img>
      </div>
      <ion-img
        class="welcome__welcome_img"
        src="/assets/images/welcome/doctor.svg"
      ></ion-img>
      <div class="welcome__buttons">
        <ion-button class="ui-button" mode="md" (click)="goToLogin()">
          {{ 'welcome.login' | translate }}
        </ion-button>
        <ion-button
          class="ui-button ui-button-outlined"
          mode="md"
          (click)="goToRegister()"
        >
          {{ 'welcome.register' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {
  }

  goToRegister() {
    this.navController.navigateForward(['/register/personal-data']);
  }

  goToLogin() {
    this.navController.navigateForward(['/login']);
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
