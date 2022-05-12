import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="registerForm" (submit)="onSubmit()">
        <ion-item lines="full">
          <ion-label position="floating">First name</ion-label>
          <ion-input formControlName="firstName" type="text"></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating">Last name</ion-label>
          <ion-input formControlName="lastName" type="text"></ion-input>
        </ion-item>
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
            <ion-button type="submit" color="danger" expand="block"
              >Sign Up</ion-button
            >
          </ion-col>
        </ion-row>
      </form>
    </ion-content>
  `,
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm = this.fb.group({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.registerForm.value);
  }
}
