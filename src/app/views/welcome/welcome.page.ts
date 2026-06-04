import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AvailableResult, BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { PlatformService } from 'src/app/services/platform/platform.service';

@Component({
  selector: 'app-welcome',
  template: `
    <ion-content class="welcome" [fullscreen]="true">
      <div class="welcome__bg" aria-hidden="true">
        <span class="welcome__blob welcome__blob--one"></span>
        <span class="welcome__blob welcome__blob--two"></span>
      </div>

      <div class="welcome__layout">
        <header class="flex justify-center pt-2 shrink-0">
          <ion-img
            class="welcome__logo"
            src="/assets/images/logos/logo-with-title.png"
            aria-label="SIGSA"
          ></ion-img>
        </header>

        <section class="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-6">
          <div class="welcome__hero-card">
            <ion-img
              class="welcome__illustration"
              src="/assets/images/welcome/doctor.svg"
              aria-hidden="true"
            ></ion-img>
          </div>

          <div class="flex flex-col gap-2 max-w-[320px] px-2">
            <h1 class="welcome__title">
              Tu salud,
              <span class="welcome__title-accent">organizada.</span>
            </h1>
            <p class="welcome__subtitle">
              Turnos, medicamentos y documentos en un solo lugar — pensado para vos y tu familia.
            </p>
          </div>
        </section>

        <footer class="flex flex-col gap-3 shrink-0">
          <button
            type="button"
            class="welcome__btn welcome__btn--primary"
            (click)="goToLogin()"
          >
            {{ 'welcome.login' | translate }}
          </button>
          <button
            type="button"
            class="welcome__btn welcome__btn--secondary"
            (click)="goToRegister()"
          >
            {{ 'welcome.register' | translate }}
          </button>
        </footer>
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
