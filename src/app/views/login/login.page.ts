import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>login</ion-title>
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
          ></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating">Password</ion-label>
          <ion-input formControlName="password" type="password"></ion-input>
        </ion-item>
        <ion-row>
          <ion-col>
            <ion-button
              type="submit"
              color="danger"
              expand="block"
              [disabled]="!loginForm.valid"
              >Sign In</ion-button
            >
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
    console.log(this.loginForm.value);
  }
}
