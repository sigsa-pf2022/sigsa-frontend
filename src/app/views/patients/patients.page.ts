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
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing pts">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Profesional</p>
        <h1 class="listing-header__title">Mis pacientes</h1>
      </header>

      <form
        class="listing-search"
        [formGroup]="searchForm"
        *ngIf="patients.length + pendingRequests.length > 0"
      >
        <ion-searchbar
          class="listing-searchbar"
          formControlName="search"
          placeholder="Buscar paciente..."
          debounce="400"
          type="string"
          mode="md"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>

      <div class="pts__scroll">
        <section *ngIf="filteredPatients.length > 0" class="pts__section">
          <div class="section-title">
            <h2>Mis pacientes</h2>
            <span>{{ filteredPatients.length }}</span>
          </div>

          <ion-item
            *ngFor="let patient of filteredPatients"
            class="list-item"
            lines="none"
            [button]="true"
            detail="false"
            (click)="viewDocuments(patient)"
          >
            <div class="list-item__icon list-item__icon--med" aria-hidden="true">
              <ion-icon name="person"></ion-icon>
            </div>
            <div class="list-item__body">
              <span class="list-item__title">{{ patient.firstName }} {{ patient.lastName }}</span>
              <span class="list-item__subtitle">
                {{ patient.patientType === 'dependent' ? 'Dependiente' : 'Usuario titular' }}
              </span>
            </div>
            <button
              type="button"
              class="member-row__action member-row__action--neutral"
              (click)="confirmUnlink(patient); $event.stopPropagation()"
              aria-label="Desvincular paciente"
            >
              <ion-icon name="ellipsis-vertical"></ion-icon>
            </button>
          </ion-item>
        </section>

        <section *ngIf="filteredPending.length > 0" class="pts__section">
          <div class="section-title">
            <h2>Pendientes</h2>
            <span>{{ filteredPending.length }}</span>
          </div>

          <ion-item
            *ngFor="let patient of filteredPending"
            class="alert-card"
            lines="none"
            [button]="true"
            detail="false"
            (click)="confirmUnlink(patient)"
          >
            <div class="alert-card__icon" aria-hidden="true">
              <ion-icon name="time"></ion-icon>
            </div>
            <div class="alert-card__body">
              <span class="alert-card__title">{{ patient.firstName }} {{ patient.lastName }}</span>
              <span class="alert-card__subtitle">Esperando autorización del responsable</span>
            </div>
          </ion-item>
        </section>

        <div
          *ngIf="filteredPatients.length === 0 && filteredPending.length === 0 && !isLoading"
          class="empty-state"
          role="status"
        >
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="people"></ion-icon>
          </div>
          <h2 class="empty-state__title">Sin pacientes todavía</h2>
          <p class="empty-state__subtitle">
            Vinculá pacientes para acceder a su historia clínica y registrar consultas.
          </p>
          <button type="button" class="empty-state__cta" (click)="addPatient()">
            <ion-icon name="person-add"></ion-icon>
            Agregar paciente
          </button>
        </div>
      </div>

      <ion-fab class="app-fab" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
          class="app-fab-button"
          (click)="addPatient()"
          aria-label="Agregar paciente"
        >
          <ion-icon name="person-add"></ion-icon>
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

  goBack() {
    this.navController.navigateBack(['/profile']);
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
