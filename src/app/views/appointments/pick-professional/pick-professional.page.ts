import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { format, formatISO, setDefaultOptions } from 'date-fns';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';
import { AppointmentDataService } from '../shared/services/appointment-data/appointment-data.service';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';

@Component({
  selector: 'app-pick-professional',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/appointments"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">{{this.isEditMode ?'Editar' : 'Crear'}} turno</ion-title>
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
        <ion-radio-group [value]="this.doctor?.id">
          <app-items-list
            class="apn__list"
            *ngFor="let doctor of this.filteredDoctors"
            (click)="setDoctor(doctor)"
            [showIcon]="false"
            [isSelectable]="true"
            [value]="doctor.id"
            [title]="'Dr/a ' + doctor.firstName + ' ' + doctor.lastName"
            img="doctor"
            height="60%"
          ></app-items-list>
        </ion-radio-group>
      </ion-list>
      <div class="apn__empty-list" *ngIf="this.filteredDoctors?.length === 0">
        <ion-text>No se encontraron doctores con los filtros solicitados.</ion-text>
        <ion-button color="secondary" fill="outline">Crea el tuyo</ion-button>
      </div>
    </ion-content>
    <ion-footer class="footer__light">
      <div class="apn__actions">
        <ion-button [disabled]="!this.doctor" (click)="nextStep()">Siguiente</ion-button>
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
  isEditMode = false;
  appointmentId: number;
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private professionalsService: ProfessionalsService,
    private appointmentsService: AppointmentsService,
    private appointmentDataService: AppointmentDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getProfessionals();
    this.setMode();
  }

  setMode() {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.appointmentId) {
      this.isEditMode = true;
      this.setAppointmentInfo();
    }
  }

  async setAppointmentInfo() {
    const appointment = await this.appointmentsService.getAppointment(this.appointmentId);
    this.setDoctor(appointment.professional);
    this.appointmentDataService.update(appointment);
  }

  setDoctor(value: Professional) {
    this.doctor = value;
  }

  async handleChange(event) {
    const search = event.detail.value;
    this.filteredDoctors = this.doctors.filter(
      (d: Professional) => d.firstName.includes(search) || d.lastName.includes(search)
    );
  }

  async getProfessionals() {
    this.doctors = await this.professionalsService.getProfessionals();
    this.filteredDoctors = this.doctors;
  }

  nextStep() {
    if (!this.isEditMode) {
      this.appointmentDataService.update(this.doctor);
    }
    const url = this.isEditMode
      ? `/appointments/edit/${this.appointmentId}/appointment`
      : '/appointments/create/appointment';
    return this.navController.navigateForward([url]);
  }
}