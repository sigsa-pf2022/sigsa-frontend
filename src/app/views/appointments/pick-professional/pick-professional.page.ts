import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { Specialization } from '../../doctors/shared/interfaces/Specialization.interface';
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
          placeholder="Buscar por nombre o apellido..."
          debounce="400"
          type="string"
          mode="md"
          (ionChange)="handleSearch()"
        ></ion-searchbar>
        <div class="auth-input pick-prof__specialty">
          <ion-select
            aria-label="Especialidad"
            formControlName="specializationId"
            placeholder="Todas las especialidades"
            interface="alert"
            okText="Confirmar"
            cancelText="Cancelar"
            (ionChange)="handleSearch()"
          >
            <ion-select-option [value]="null">Todas las especialidades</ion-select-option>
            <ion-select-option *ngFor="let spec of specializations" [value]="spec.id">
              {{ spec.name }}
            </ion-select-option>
          </ion-select>
        </div>
      </form>

      <p class="pick-prof__selected" *ngIf="this.doctor && !isLoaded(this.doctor)">
        Seleccionado: Dr/a {{ this.doctor.firstName + ' ' + this.doctor.lastName | titlecase }}
      </p>

      <app-loading-state *ngIf="this.isLoading" [rows]="6"></app-loading-state>

      <div class="pick-prof__scroll" *ngIf="!this.isLoading">
        <ng-container *ngIf="this.doctors?.length > 0; else emptyState">
          <ng-container *ngIf="this.linkedDoctors.length > 0">
            <div class="section-title pick-prof__section"><h2>Tus profesionales</h2></div>
            <ng-container *ngFor="let doctorOption of this.linkedDoctors">
              <ng-container *ngTemplateOutlet="doctorItem; context: { $implicit: doctorOption }"></ng-container>
            </ng-container>
            <div class="section-title pick-prof__section" *ngIf="this.otherDoctors.length > 0">
              <h2>Otros profesionales</h2>
            </div>
          </ng-container>
          <ng-container *ngFor="let doctorOption of this.otherDoctors">
            <ng-container *ngTemplateOutlet="doctorItem; context: { $implicit: doctorOption }"></ng-container>
          </ng-container>
        </ng-container>

        <ng-template #doctorItem let-doctorOption>
          <app-items-list
            (click)="setDoctor(doctorOption)"
            [showIcon]="false"
            [isSelectable]="true"
            [value]="doctorOption.id"
            [selectedValue]="this.doctor?.id"
            [title]="'Dr/a ' + (doctorOption.firstName + ' ' + doctorOption.lastName | titlecase)"
            [subtitle]="specialtiesOf(doctorOption)"
            img="doctor"
          ></app-items-list>
        </ng-template>

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

      <ion-infinite-scroll
        *ngIf="!this.isLoading"
        [disabled]="!this.hasMore"
        (ionInfinite)="loadMore($event)"
      >
        <ion-infinite-scroll-content loadingSpinner="crescent"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
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
  private static readonly pageSize = 20;

  searchForm = this.fb.group({
    search: '',
    specializationId: null as number | null,
  });
  doctor: Professional;
  doctors: Professional[] = [];
  specializations: Specialization[] = [];
  isLoading = true;
  hasMore = false;
  isEditMode = false;
  appointmentId: number;
  dependentId: number;
  dependentName: string;
  groupId: string;
  private page = 0;
  /** Descarta respuestas viejas si el usuario sigue tipeando. */
  private requestId = 0;

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private professionalsService: ProfessionalsService,
    private appointmentsService: AppointmentsService,
    private appointmentDataService: AppointmentDataService,
    private route: ActivatedRoute
  ) {}

  get linkedDoctors(): Professional[] {
    return this.doctors.filter((d) => d.linked);
  }

  get otherDoctors(): Professional[] {
    return this.doctors.filter((d) => !d.linked);
  }

  ngOnInit() {
    this.loadSpecializations();
  }

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

    this.loadFirstPage();
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

  handleSearch() {
    this.loadFirstPage();
  }

  /** En edición el profesional del turno puede no estar en la página cargada. */
  isLoaded(professional: Professional): boolean {
    return this.doctors.some((d) => d.id === professional?.id);
  }

  specialtiesOf(professional: Professional): string {
    return (professional.specialization || []).map((s) => s.name).join(', ');
  }

  async loadSpecializations() {
    try {
      const all: Specialization[] = await this.professionalsService.getProfessionalsSpecializations();
      this.specializations = (all || [])
        .filter((s) => !s.deleted)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('PickProfessionalPage: error cargando especialidades', error);
    }
  }

  async loadFirstPage() {
    // Sin este flag el listado vacío hacía aparecer "No encontramos
    // profesionales" mientras la request estaba en vuelo.
    this.isLoading = true;
    this.page = 0;
    try {
      const result = await this.fetchPage(0);
      // Una búsqueda más nueva ya está en vuelo: ella apaga el loading.
      if (!result) {
        return;
      }
      this.doctors = result.data;
      this.hasMore = this.doctors.length < result.total;
      this.isLoading = false;
    } catch (error) {
      console.error('PickProfessionalPage: error cargando profesionales', error);
      this.isLoading = false;
    }
  }

  async loadMore(event) {
    try {
      const result = await this.fetchPage(this.page + 1);
      if (result) {
        this.page += 1;
        this.doctors = [...this.doctors, ...result.data];
        this.hasMore = this.doctors.length < result.total;
      }
    } catch (error) {
      console.error('PickProfessionalPage: error cargando más profesionales', error);
    } finally {
      event.target.complete();
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

  /** null si mientras tanto salió otra búsqueda más nueva. */
  private async fetchPage(page: number) {
    const id = ++this.requestId;
    const { search, specializationId } = this.searchForm.value;
    const result = await this.professionalsService.searchProfessionals({
      search: (search || '').trim(),
      specializationId: specializationId || undefined,
      dependentId: this.dependentId || undefined,
      page,
      take: PickProfessionalPage.pageSize,
    });
    return id === this.requestId ? result : null;
  }
}
