import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PatientsService } from '../shared/services/patients.service';

@Component({
  selector: 'app-add-patient',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/patients"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Agregar Paciente</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ap">
      <div class="ap__search">
        <ion-label class="ap__search__label">Ingrese el DNI del paciente</ion-label>
        <form [formGroup]="searchForm" (ngSubmit)="searchPatient()">
          <ion-item>
            <ion-input
              formControlName="dni"
              placeholder="DNI"
              type="number"
              inputmode="numeric"
            ></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            type="submit"
            [disabled]="searchForm.invalid || isSearching"
            style="margin-top: 16px;"
          >
            {{ isSearching ? 'Buscando...' : 'Buscar' }}
          </ion-button>
        </form>
      </div>

      <div class="ap__result" *ngIf="foundPatient">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ foundPatient.firstName }} {{ foundPatient.lastName }}</ion-card-title>
            <ion-card-subtitle>DNI: {{ foundPatient.dni }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-button
              expand="block"
              (click)="linkPatient()"
              [disabled]="isLinking"
            >
              {{ isLinking ? 'Vinculando...' : 'Vincular como paciente' }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <div class="ap__not-found" *ngIf="searchDone && !foundPatient">
        <ion-icon name="alert-circle-outline" style="font-size: 48px; color: var(--ion-color-warning);"></ion-icon>
        <ion-label style="text-align: center; margin-top: 12px;">
          No se encontró un usuario con ese DNI.
        </ion-label>
      </div>
    </ion-content>
  `,
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {
  searchForm = this.fb.group({
    dni: ['', [Validators.required]],
  });

  foundPatient: any = null;
  searchDone = false;
  isSearching = false;
  isLinking = false;

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private authService: AuthenticationService,
    private patientsService: PatientsService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {}

  async searchPatient() {
    const dni = this.searchForm.get('dni').value;
    this.isSearching = true;
    this.foundPatient = null;
    this.searchDone = false;
    try {
      const user = await this.authService.getUserByDni(dni);
      if (user && user.firstName) {
        this.foundPatient = { ...user, patientType: 'user' };
      }
    } catch {
      // Not found
    }
    this.searchDone = true;
    this.isSearching = false;
  }

  async linkPatient() {
    if (!this.foundPatient) return;
    this.isLinking = true;
    try {
      await this.patientsService.linkPatient(
        this.foundPatient.id,
        this.foundPatient.patientType,
      );
      this.toastService.showSuccess('Paciente vinculado correctamente');
      this.navController.back();
    } catch (error) {
      const message = error?.error?.message || 'Error al vincular paciente';
      this.toastService.showError(message);
    } finally {
      this.isLinking = false;
    }
  }
}
