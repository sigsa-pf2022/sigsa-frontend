import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-doctors-new',
  template: ` <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/doctors"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo Profesional</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="dn">
      <ion-img class="dn__img" src="assets/images/doctors/new-doctor.svg"></ion-img>
      <form class="dn__form" [formGroup]="newDoctorForm">
        <ion-input
          class="ui-form-input"
          formControlName="firstName"
          placeholder="Nombre"
        >
        </ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="lastName"
          placeholder="Apellido"
        >
        </ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="field"
          placeholder="Especialidad"
        >
        </ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="clinic"
          placeholder="Clinica"
        >
        </ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="streetName"
          placeholder="Calle"
        >
        </ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="streetNumber"
          placeholder="Altura"
        >
        </ion-input>
        <ion-button type='submit'>Aceptar</ion-button>
      </form>
    </ion-content>`,
  styleUrls: ['./doctors-new.page.scss'],
})
export class DoctorsNewPage implements OnInit {
  newDoctorForm = this.fb.group({
    firstName: '',
    lastName: '',
    field: '',
    clinic: '',
    streetName: '',
    streetNumber: null,
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
  }
}
