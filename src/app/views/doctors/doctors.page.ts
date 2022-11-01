import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FAKE_APPOINTMENTS_DATA } from 'src/app/data/appointmentsData';

@Component({
  selector: 'app-doctors',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profile"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Mis Profesionales</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="drs">
      <form [formGroup]="this.searchForm">
        <ion-input
          class="ui-form-input drs__search"
          placeholder="Buscar doctor ..."
          formControlName="input"
        >
          <ion-icon class="drs__search__icon" name="search"></ion-icon>
        </ion-input>
      </form>
      <app-items-list
        class="drs__list"
        [items]="this.doctors"
        height="70%"
      ></app-items-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="newDoctor()" class="drs__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {
  searchForm = this.fb.group({ input: '' });
  doctors = FAKE_APPOINTMENTS_DATA;
  constructor(private navController: NavController, private fb: FormBuilder) {}

  ngOnInit() {}
  newDoctor() {
    return this.navController.navigateForward(['/doctors/new']);
  }
}
