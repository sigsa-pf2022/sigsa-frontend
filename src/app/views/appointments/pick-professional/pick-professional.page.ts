import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';
import { AppointmentDataService } from '../shared/services/appointment-data/appointment-data.service';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';
import { slideUpAnimation } from 'src/app/animations/slide-up.animation';

@Component({
  selector: 'app-pick-professional',
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
          <div class="auth-stepper" aria-label="Paso 1 de 2">
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <div class="auth-stepper__bar"></div>
            <span class="auth-stepper__count">1/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">
          {{ this.isEditMode ? 'Editar turno' : 'Nuevo turno' }}
          <ng-container *ngIf="dependentName"> · para {{ dependentName | titlecase }}</ng-container>
        </p>
        <h1 class="listing-header__title">Elegí al profesional</h1>
      </header>

      <form [formGroup]="this.searchForm" class="listing-search">
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

      <app-loading-state *ngIf="this.isLoading" [rows]="6"></app-loading-state>

      <div class="pick-prof__scroll" *ngIf="!this.isLoading">
        <ng-container *ngIf="this.filteredDoctors?.length > 0; else emptyState">
          <app-items-list
            *ngFor="let doctorOption of this.filteredDoctors"
            (click)="setDoctor(doctorOption)"
            [showIcon]="false"
            [isSelectable]="true"
            [value]="doctorOption.id"
            [selectedValue]="this.doctor?.id"
            [title]="'Dr/a ' + (doctorOption.firstName + ' ' + doctorOption.lastName | titlecase)"
            img="doctor"
          ></app-items-list>
        </ng-container>

        <ng-template #emptyState>
          <div class="empty-state" role="status">
            <div class="empty-state__icon" aria-hidden="true">
              <ion-icon name="people-outline"></ion-icon>
            </div>
            <h2 class="empty-state__title">No encontramos profesionales</h2>
            <p class="empty-state__subtitle">
              Probá con otra búsqueda o cargá tu profesional de confianza.
            </p>
            <button type="button" class="empty-state__cta" (click)="goToMyProfessionals()">
              <ion-icon name="person-add-outline"></ion-icon>
              Usar mi profesional
            </button>
          </div>
        </ng-template>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
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
  styleUrls: ['./pick-professional.page.scss'],
})
export class PickProfessionalPage implements OnInit {
  searchForm = this.fb.group({
    search: '',
  });
  doctor: Professional;
  doctors: Professional[];
  filteredDoctors: Professional[];
  isLoading = true;
  isEditMode = false;
  appointmentId: number;
  dependentId: number;
  dependentName: string;
  groupId: string;

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
    // Capturar parámetros del dependiente si existen
    this.route.queryParams.subscribe(params => {
      const rawDependentId = params['dependentId'];
      this.dependentId =
        rawDependentId !== undefined && rawDependentId !== null && rawDependentId !== ''
          ? Number(rawDependentId)
          : null;
      this.dependentName = params['dependentName'] || null;
      this.groupId = params['groupId'] || null;

      // Persistir (sirve para fallback en el siguiente paso)
      if (this.dependentId) {
        this.appointmentDataService.update({
          dependentId: this.dependentId,
          dependentName: this.dependentName,
          groupId: this.groupId,
        });
      }
    });

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
    const search = (event.detail.value || '').toLowerCase();
    this.filteredDoctors = this.doctors.filter(
      (professional: Professional) =>
        (professional.firstName ?? '').toLowerCase().includes(search) ||
        (professional.lastName ?? '').toLowerCase().includes(search)
    );
  }

  async getProfessionals() {
    // Sin este flag el listado vacío hacía aparecer "No encontramos
    // profesionales" mientras la request estaba en vuelo.
    this.isLoading = !this.doctors?.length;
    try {
      this.doctors = await this.professionalsService.getProfessionals();
      this.filteredDoctors = this.doctors;
    } catch (error) {
      console.error('PickProfessionalPage: error cargando profesionales', error);
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    const fallback = this.groupId ? `/groups/home/${this.groupId}` : '/tabs/appointments';
    this.navController.navigateBack([fallback], { animation: slideUpAnimation });
  }

  nextStep() {
    this.appointmentDataService.update({
      professional: this.doctor,
      isMyProfessional: false,
      dependentId: this.dependentId,
      dependentName: this.dependentName,
      groupId: this.groupId
    });

    const url = this.isEditMode
      ? `/appointments/edit/${this.appointmentId}/appointment`
      : '/appointments/create/appointment';

    const navigationExtras = this.dependentId ? {
      queryParams: {
        dependentId: this.dependentId,
        dependentName: this.dependentName,
        groupId: this.groupId
      }
    } : {};

    return this.navController.navigateForward([url], navigationExtras);
  }

  goToMyProfessionals() {
    this.doctor = null;
    this.searchForm.reset();
    const url = this.isEditMode
      ? `/appointments/edit/${this.appointmentId}/my-doctors`
      : '/appointments/create/my-doctors';

    const navigationExtras = this.dependentId ? {
      queryParams: {
        dependentId: this.dependentId,
        dependentName: this.dependentName,
        groupId: this.groupId
      }
    } : {};

    return this.navController.navigateForward([url], navigationExtras);
  }
}
