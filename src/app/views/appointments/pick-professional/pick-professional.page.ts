import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';
import { AppointmentDataService } from '../shared/services/appointment-data/appointment-data.service';

@Component({
  selector: 'app-pick-professional',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/appointments"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo Turno</ion-title>
        <ion-label class="ui-header__counter" slot="end">1 de 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="apn">
      <form [formGroup]="this.searchForm">
        <ion-searchbar
          formControlName="search"
          placeholder="Buscar profesionales ..."
          class="ui-search-input  ui-search-input__no-show"
          debounce="400"
          type="string"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>
      <ion-list *ngIf="this.filteredDoctors?.length > 0">
        <ion-radio-group [value]="this.doctor">
          <app-items-list
            class="apn__list"
            *ngFor="let doctor of this.filteredDoctors"
            (click)="setDoctor(doctor)"
            [showIcon]="false"
            [isSelectable]="true"
            [value]="doctor"
            [title]="doctor.firstName + ' ' + doctor.lastName"
            [subtitle]="doctor.field"
            img="doctor"
            height="60%"
          ></app-items-list>
        </ion-radio-group>
      </ion-list>
      <div *ngIf="this.filteredDoctors?.length === 0">
        <ion-text>No se encontraron doctores con los filtros solicitados. Crea el tuyo!</ion-text>
      </div>
    </ion-content>
    <ion-footer class="footer__light">
      <div class="apn__actions">
        <ion-button class="ui-button-outlined" (click)="newDoctor()">Cargar Nuevo Profesional</ion-button>
        <ion-button [disabled]="!this.doctor" (click)="goToCreateAppointment()">Siguiente</ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./pick-professional.page.scss'],
})
export class PickProfessionalPage implements OnInit {
  searchForm = this.fb.group({
    search: '',
  });
  doctor: any;
  doctors: Professional[];
  filteredDoctors: Professional[];

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private professionalsService: ProfessionalsService,
    private appointmentDataService: AppointmentDataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getProfessionals();
  }

  setDoctor(value: Professional) {
    this.doctor = value;
  }

  async handleChange(event) {
    const search = event.detail.value;
    this.filteredDoctors = this.doctors.filter(
      (d: Professional) => d.firstName.includes(search) || d.lastName.includes(search) || d.field.includes(search)
    );
  }

  newDoctor() {
    return this.navController.navigateForward(['doctors/new']);
  }

  async getProfessionals() {
    this.doctors = await this.professionalsService.getProfessionals();
    console.log(this.doctors);
    this.filteredDoctors = this.doctors;
  }

  goToCreateAppointment() {
    this.appointmentDataService.update(this.doctor);
    return this.navController.navigateForward(['/appointments/create']);
  }
}
