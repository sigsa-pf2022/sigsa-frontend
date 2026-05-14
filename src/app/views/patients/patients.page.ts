import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PatientLink } from './shared/interfaces/PatientLink.interface';
import { PatientsService } from './shared/services/patients.service';

@Component({
  selector: 'app-patients',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profile"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Mis Pacientes</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="pts">
      <form class="pts__form" [formGroup]="searchForm">
        <ion-searchbar
          formControlName="search"
          placeholder="Buscar pacientes ..."
          class="ui-search-input ui-search-input__no-show"
          debounce="400"
          type="string"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>

      <!-- Sección: Mis pacientes (ACCEPTED) -->
      <ion-list-header *ngIf="filteredPatients.length > 0">
        <ion-label>Mis pacientes</ion-label>
      </ion-list-header>
      <ion-list class="pts__list" *ngIf="filteredPatients.length > 0">
        <app-items-list
          *ngFor="let patient of filteredPatients"
          [title]="patient.firstName + ' ' + patient.lastName"
          [subtitle]="patient.patientType === 'dependent' ? 'Dependiente' : 'Usuario'"
          img="doctor"
          [showIcon]="true"
          (click)="viewDocuments(patient)"
          (press)="confirmUnlink(patient)"
        ></app-items-list>
      </ion-list>

      <!-- Sección: Solicitudes pendientes (PENDING) -->
      <ion-list-header *ngIf="filteredPending.length > 0">
        <ion-label>
          Solicitudes pendientes
          <ion-badge color="warning" style="margin-left: 8px;">{{ filteredPending.length }}</ion-badge>
        </ion-label>
      </ion-list-header>
      <ion-list *ngIf="filteredPending.length > 0">
        <app-items-list
          *ngFor="let patient of filteredPending"
          [title]="patient.firstName + ' ' + patient.lastName"
          subtitle="Esperando autorización del responsable"
          img="doctor"
          [showIcon]="false"
          (press)="confirmUnlink(patient)"
        ></app-items-list>
      </ion-list>

      <div
        class="pts__empty"
        *ngIf="filteredPatients.length === 0 && filteredPending.length === 0 && !isLoading"
      >
        <ion-icon name="people-outline" style="font-size: 64px; color: var(--ion-color-medium);"></ion-icon>
        <ion-label style="text-align: center; margin-top: 16px; color: var(--ion-color-medium);">
          No tenés pacientes vinculados.<br />
          Presioná + para agregar uno.
        </ion-label>
      </div>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="addPatient()" class="pts__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  searchForm = this.fb.group({ search: '' });
  patients: PatientLink[] = [];
  pendingRequests: PatientLink[] = [];
  filteredPatients: PatientLink[] = [];
  filteredPending: PatientLink[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private patientsService: PatientsService,
    private modalController: ModalController,
    private toastService: ToastService,
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.loadPatients();
  }

  private async loadPatients() {
    this.isLoading = true;
    try {
      const res = await this.patientsService.getPatients();
      this.patients = res?.patients || [];
      this.pendingRequests = res?.pendingRequests || [];
      this.filteredPatients = this.patients;
      this.filteredPending = this.pendingRequests;
    } catch (error) {
      this.toastService.showError('Error al cargar pacientes');
      this.patients = [];
      this.pendingRequests = [];
      this.filteredPatients = [];
      this.filteredPending = [];
    } finally {
      this.isLoading = false;
    }
  }

  handleChange(event) {
    const search = (event.detail.value || '').toLowerCase();
    this.filteredPatients = this.patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search),
    );
    this.filteredPending = this.pendingRequests.filter(
      (p) =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search),
    );
  }

  addPatient() {
    this.navController.navigateForward(['/patients/add']);
  }

  viewDocuments(patient: PatientLink) {
    this.navController.navigateForward(
      [`/patients/${patient.patientId}/documents`],
      {
        queryParams: {
          patientType: patient.patientType,
          name: `${patient.firstName} ${patient.lastName}`,
        },
      },
    );
  }

  async confirmUnlink(patient: PatientLink) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: `¿Cancelar vinculación con ${patient.firstName} ${patient.lastName}?`,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      try {
        await this.patientsService.unlinkPatient(patient.patientId, patient.patientType);
        this.toastService.showSuccess('Paciente desvinculado');
        await this.loadPatients();
      } catch {
        this.toastService.showError('Error al desvincular');
      }
    }
  }
}
