import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AvailableResult, BiometryType, Credentials, NativeBiometric } from 'capacitor-native-biometric';

@Component({
  selector: 'app-login',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="loginForm" (submit)="onSubmit()">
        <ion-item lines="full">
          <ion-label position="floating">Email</ion-label>
          <ion-input
            formControlName="email"
            type="email"
            inputmode="email"
            autocomplete="off"
          ></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input
            formControlName="password"
            type="password"
            autocomplete="off"
          ></ion-input>
        </ion-item>
        <ion-row>
          <ion-col>
            <ion-button
              type="submit"
              color="danger"
              expand="block"
              [disabled]="!loginForm.valid"
            >
              Ingresar
            </ion-button>
          </ion-col>
        </ion-row>
      </form>
    </ion-content>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = this.fb.group({
    email: [null, Validators.email],
    password: null,
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  onSubmit() {
    this.biometricLogin();
    // try {
    // } catch (error) {
    //   console.log(error);
    // }
  }

  biometricLogin(){
    NativeBiometric.isAvailable().then(
      (result: AvailableResult) => {
        const isAvailable = result.isAvailable;
        const isTouchId = result.biometryType === BiometryType.FINGERPRINT;
        if (isAvailable) {
          // Get user's credentials
            // Authenticate using biometrics before logging the user in
            NativeBiometric.verifyIdentity({
              reason: 'For easy log in',
              title: 'Log in',
              subtitle: 'Maybe add subtitle here?',
              description: 'Maybe a description too?',
            }).then(
              () => {
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
