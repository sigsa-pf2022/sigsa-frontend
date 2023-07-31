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
      <form [formGroup]="this.searchForm">
        <ion-input class="ui-form-input drs__search" placeholder="Buscar doctor ..." formControlName="input">
          <ion-icon class="drs__search__icon" name="search"></ion-icon>
        </ion-input>
      </form>
      <ion-list class="drs__list" *ngIf="this.doctors.length > 0">
        <ion-radio-group [value]="this.doctor?.id">
          <app-items-list
            *ngFor="let doctor of this.doctors"
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
  searchForm = this.fb.group({ input: '' });
  doctors: Professional[] = [];
  isAppointmentCreation = false;
  isAppointmentEdition = false;
  doctor: Professional;
  appointmentId: number;
  constructor(
    private navController: NavController,
    private fb: FormBuilder,
    private professionalsService: ProfessionalsService,
    private route: ActivatedRoute,
    private appointmentDataService: AppointmentDataService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.doctors = await this.professionalsService.getMyProfessionals();
    if (this.route.snapshot.url[0]?.path === 'create') {
      this.isAppointmentCreation = true;
    } else if (this.route.snapshot.url[0]?.path === 'edit') {
      this.isAppointmentEdition = true;
      this.appointmentId = Number(this.route.snapshot.url[1].path);
    }
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
    this.appointmentDataService.update({ professional: this.doctor, isMyProfessional: true });
    const url = this.isAppointmentCreation
      ? '/appointments/create/appointment'
      : `/appointments/edit/${this.appointmentId}/appointment`;
    return this.navController.navigateForward([url]);
  }
}
