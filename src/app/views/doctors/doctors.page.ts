import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppointmentDataService } from '../appointments/shared/services/appointment-data/appointment-data.service';
import { Professional } from './shared/interfaces/Professional.interface';
import { ProfessionalsService } from './shared/services/professionals.service';

@Component({
  selector: 'app-doctors',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profile"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">{{
          isAppointmentCreation ? 'Crear turno' : this.isAppointmentEdition ? 'Editar turno' : 'Mis Profesionales'
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="drs">
      <form class="drs__form" [formGroup]="this.searchForm">
      <ion-searchbar
          formControlName="search"
          placeholder="Buscar profesionales ..."
          class="ui-search-input  ui-search-input__no-show"
          debounce="400"
          type="string"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>
      <ion-list class="drs__list" *ngIf="this.filteredDoctors.length > 0">
        <ion-radio-group [value]="this.doctor?.id">
          <app-items-list
            *ngFor="let doctor of this.filteredDoctors"
            [title]="doctor.firstName + ' ' + doctor.lastName"
            img="doctor"
            [isSelectable]="this.isAppointmentCreation || this.isAppointmentEdition"
            [showIcon]="!this.isAppointmentCreation && !this.isAppointmentEdition"
            (click)="doAction(doctor)"
          ></app-items-list>
        </ion-radio-group>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="newDoctor()" class="drs__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <ion-footer class="footer__light" *ngIf="this.isAppointmentCreation || this.isAppointmentEdition">
      <div class="apn__actions">
        <ion-button [disabled]="!this.doctor" expand="block" (click)="nextStep()">Siguiente</ion-button>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {
  searchForm = this.fb.group({
    search: '',
  });
  doctors: Professional[] = [];
  isAppointmentCreation = false;
  isAppointmentEdition = false;
  doctor: Professional;
  appointmentId: number;
  filteredDoctors: Professional[] = [];
  // Datos de dependiente (si la creación viene desde un grupo / dependiente)
  dependentId: number;
  dependentName: string;
  groupId: string;
  constructor(
    private navController: NavController,
    private fb: FormBuilder,
    private professionalsService: ProfessionalsService,
    private route: ActivatedRoute,
    private appointmentDataService: AppointmentDataService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.doctors = this.filteredDoctors = await this.professionalsService.getMyProfessionals();
    if (this.route.snapshot.url[0]?.path === 'create') {
      this.isAppointmentCreation = true;
    } else if (this.route.snapshot.url[0]?.path === 'edit') {
      this.isAppointmentEdition = true;
      this.appointmentId = Number(this.route.snapshot.url[1].path);
    }

    // Captura de query params para dependiente
    this.route.queryParams.subscribe(params => {
      const rawDependentId = params['dependentId'];
      this.dependentId = rawDependentId !== undefined && rawDependentId !== null && rawDependentId !== ''
        ? Number(rawDependentId)
        : null;
      this.dependentName = params['dependentName'] || null;
      this.groupId = params['groupId'] || null;
    });
  }
  newDoctor() {
    return this.navController.navigateForward(['/doctors/new']);
  }
  doAction(doctor) {
    if (this.isAppointmentCreation || this.isAppointmentEdition) {
      this.doctor = doctor;
    }
  }
  nextStep() {
    this.appointmentDataService.update({ 
      professional: this.doctor, 
      isMyProfessional: true,
      // Persistir info de dependiente para siguiente paso
      dependentId: this.dependentId,
      dependentName: this.dependentName,
      groupId: this.groupId,
    });
    const url = this.isAppointmentCreation
      ? '/appointments/create/appointment'
      : `/appointments/edit/${this.appointmentId}/appointment`;
    const navigationExtras = this.dependentId ? {
      queryParams: {
        dependentId: this.dependentId,
        dependentName: this.dependentName,
        groupId: this.groupId,
      }
    } : {};
    return this.navController.navigateForward([url], navigationExtras);
  }
  
  async handleChange(event) {
    const search = event.detail.value.toLowerCase();
    this.filteredDoctors = this.doctors.filter(
      (professional: Professional) =>
        professional.firstName.toLowerCase().includes(search) || professional.lastName.toLowerCase().includes(search)
    );
  }
}
