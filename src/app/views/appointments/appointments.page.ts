import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FAKE_APPOINTMENTS_DATA } from 'src/app/data/appointmentsData';

@Component({
  selector: 'app-appointments',
  template: `<ion-content class="apts">
    <ion-label class="apts__title"> Mis Turnos </ion-label>
    <form [formGroup]="this.searchForm">
      <ion-input class="ui-form-input apts__search" placeholder="Buscar turno ..." formControlName="input">
        <ion-icon class="apts__search__icon" name="search"></ion-icon>
      </ion-input>
    </form>
    <ion-list class="apts__list">
      <app-items-list
        *ngFor="let appointment of this.appointments"
        [title]="appointment.title"
        [subtitle]="appointment.subtitle"
        [img]="appointment.img"
        height="70%"
      ></app-items-list>
    </ion-list>
    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
      <ion-fab-button (click)="newAppointment()" class="apts__fab">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>`,
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  appointments = FAKE_APPOINTMENTS_DATA;
  searchForm = this.fb.group({
    input: '',
  });
  constructor(private fb: FormBuilder, private navController: NavController) {}

  ngOnInit() {
    this.searchForm.valueChanges.subscribe((value) => this.search(value));
  }

  search(value) {
    this.appointments = FAKE_APPOINTMENTS_DATA.filter(
      (app) =>
        app.title.toUpperCase().includes(value.input.toUpperCase()) ||
        app.subtitle.toUpperCase().includes(value.input.toUpperCase())
    );
  }

  newAppointment() {
    return this.navController.navigateForward(['/appointments/pick-doctor']);
  }
}
