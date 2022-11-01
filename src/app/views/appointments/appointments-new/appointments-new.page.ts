import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FAKE_APPOINTMENTS_DATA } from 'src/app/data/appointmentsData';

@Component({
  selector: 'app-appointments-new',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/appointment"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo Turno</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="apn">
      <form [formGroup]="this.searchForm">
        <ion-input
          class="ui-form-input apn__search"
          placeholder="Buscar medicos ..."
          formControlName="input"
        >
          <ion-icon class="apn__search__icon" name="search"></ion-icon>
        </ion-input>
      </form>
      <ion-segment class="apn__segment" [value]="'created_doctors'">
        <ion-segment-button
          disabled
          class="apn__segment__button"
          [value]="'doctors'"
        >
          <ion-label>Profesionales</ion-label>
        </ion-segment-button>
        <ion-segment-button
          class="apn__segment__button"
          [value]="'created_doctors'"
        >
          <ion-label>Mis Profesionales</ion-label>
        </ion-segment-button>
      </ion-segment>
      <app-selectable-items-list
        class="apn__list"
        [items]="this.appointments"
        (selectDoctor)="setDoctor($event)"
        height="60%"
      ></app-selectable-items-list>
      <div class="apn__actions">
        <ion-button class="ui-button-outlined" (click)="newDoctor()"
          >Cargar Nuevo Profesional</ion-button
        >
        <ion-button [disabled]='!this.doctor'>Siguiente</ion-button>
      </div>
    </ion-content>`,
  styleUrls: ['./appointments-new.page.scss'],
})
export class AppointmentsNewPage implements OnInit {
  searchForm = this.fb.group({
    input: '',
  });
  doctor: any;
  appointments = FAKE_APPOINTMENTS_DATA;

  constructor(private fb: FormBuilder, private navController: NavController) {}

  ngOnInit() {}

  setDoctor(value) {
    this.doctor = value;
  }

  newDoctor(){
    return this.navController.navigateForward(['doctors/new']);
  }
}
