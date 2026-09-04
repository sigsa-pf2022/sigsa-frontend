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
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goBack()"
            aria-label="Volver"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div
            class="auth-stepper"
            *ngIf="isAppointmentCreation || isAppointmentEdition"
            aria-label="Paso 1 de 2"
          >
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <div class="auth-stepper__bar"></div>
            <span class="auth-stepper__count">1/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing drs">
      <header class="listing-header">
        <p class="listing-header__eyebrow">
          {{ isAppointmentCreation ? 'Nuevo turno' :
             isAppointmentEdition ? 'Editar turno' :
             'Tus profesionales' }}
        </p>
        <h1 class="listing-header__title">
          {{ isAppointmentCreation || isAppointmentEdition ? 'Elegí al profesional' : 'Mis profesionales' }}
        </h1>
      </header>

      <form
        class="listing-search"
        [formGroup]="this.searchForm"
        *ngIf="!this.isLoading && doctors.length > 0"
      >
        <ion-searchbar
          class="listing-searchbar"
          formControlName="search"
          placeholder="Buscar profesional..."
          debounce="400"
          type="string"
          mode="md"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>

      <app-loading-state *ngIf="this.isLoading" [rows]="5"></app-loading-state>

      <div class="drs__scroll" *ngIf="!this.isLoading">
        <ng-container *ngIf="this.filteredDoctors.length > 0; else emptyState">
          <!--
            Fuera del alta/edición de turno esta pantalla es sólo un listado:
            no hay vista de detalle del profesional a la que ir. Por eso no
            lleva chevron ni efecto de pulsado, que hacían parecer que la fila
            abría algo. Al elegir profesional para un turno sí es seleccionable.
          -->
          <app-items-list
            *ngFor="let doctorOption of this.filteredDoctors"
            [title]="'Dr/a ' + doctorOption.firstName + ' ' + doctorOption.lastName"
            img="doctor"
            [isSelectable]="this.isAppointmentCreation || this.isAppointmentEdition"
            [tappable]="this.isAppointmentCreation || this.isAppointmentEdition"
            [showIcon]="false"
            [value]="doctorOption.id"
            [selectedValue]="this.doctor?.id"
            (click)="doAction(doctorOption)"
          ></app-items-list>
        </ng-container>

        <ng-template #emptyState>
          <div class="empty-state" role="status">
            <div class="empty-state__icon" aria-hidden="true">
              <ion-icon name="people"></ion-icon>
            </div>
            <h2 class="empty-state__title">Sin profesionales</h2>
            <p class="empty-state__subtitle">
              Sumá tu profesional de confianza para agendar turnos rápido.
            </p>
            <button type="button" class="empty-state__cta" (click)="newDoctor()">
              <ion-icon name="add"></ion-icon>
              Agregar profesional
            </button>
          </div>
        </ng-template>
      </div>

      <ion-fab
        class="app-fab"
        vertical="bottom"
        horizontal="center"
        slot="fixed"
        *ngIf="!isAppointmentCreation && !isAppointmentEdition"
      >
        <ion-fab-button
          class="app-fab-button"
          (click)="newDoctor()"
          aria-label="Agregar profesional"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <ion-footer
      class="auth-footer"
      mode="md"
      *ngIf="this.isAppointmentCreation || this.isAppointmentEdition"
    >
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="nextStep()"
        [disabled]="!this.doctor"
      >
        Siguiente
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {
  searchForm = this.fb.group({
    search: '',
  });
  doctors: Professional[] = [];
  isLoading = true;
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
    // Solo mostramos el skeleton si no hay nada en pantalla: al volver a la
    // vista refrescamos en silencio sobre los datos que ya se ven.
    this.isLoading = this.doctors.length === 0;
    try {
      this.doctors = this.filteredDoctors = await this.professionalsService.getMyProfessionals();
    } catch (error) {
      console.error('DoctorsPage: error cargando profesionales', error);
    } finally {
      this.isLoading = false;
    }

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
  goBack() {
    if (this.isAppointmentCreation || this.isAppointmentEdition) {
      this.navController.navigateBack(['/tabs/appointments']);
    } else {
      this.navController.navigateBack(['/profile']);
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
    const search = (event.detail.value || '').toLowerCase();
    this.filteredDoctors = this.doctors.filter(
      (professional: Professional) =>
        (professional.firstName ?? '').toLowerCase().includes(search) ||
        (professional.lastName ?? '').toLowerCase().includes(search)
    );
  }
}
