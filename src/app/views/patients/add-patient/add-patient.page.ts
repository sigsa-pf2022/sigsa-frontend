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
        <form [formGroup]="searchForm">
          <ion-item>
            <ion-input
              formControlName="dni"
              placeholder="DNI"
              type="text"
              inputmode="numeric"
              (keyup.enter)="searchPatient()"
            ></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            (click)="searchPatient()"
            [disabled]="searchForm.invalid || isSearching"
            style="margin-top: 16px;"
          >
            {{ isSearching ? 'Buscando...' : 'Buscar' }}
          </ion-button>
        </form>
      </div>

      <!-- Resultado: usuario titular -->
      <div class="ap__result" *ngIf="foundPatient && foundPatient.patientType === 'user'">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>
              <ion-badge color="primary">Titular de cuenta</ion-badge>
            </ion-card-subtitle>
            <ion-card-title>{{ foundPatient.firstName }} {{ foundPatient.lastName }}</ion-card-title>
            <ion-card-subtitle>DNI: {{ foundPatient.dni }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-button expand="block" (click)="linkPatient()" [disabled]="isLinking">
              {{ isLinking ? 'Vinculando...' : 'Vincular paciente' }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Resultado: dependiente -->
      <div class="ap__result" *ngIf="foundPatient && foundPatient.patientType === 'dependent'">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>
              <ion-badge color="warning">Dependiente de grupo familiar</ion-badge>
            </ion-card-subtitle>
            <ion-card-title>
              {{ foundPatient.dependentFirstName }} {{ foundPatient.dependentLastName }}
            </ion-card-title>
            <ion-card-subtitle>DNI: {{ foundPatient.dependentDni }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p style="margin-bottom: 12px; color: var(--ion-color-medium); font-size: 0.9em;">
              Este dependiente pertenece al grupo <strong>{{ foundPatient.groupName }}</strong>,
              administrado por <strong>{{ foundPatient.responsibleFirstName }} {{ foundPatient.responsibleLastName }}</strong>.
              Al enviar la solicitud, el responsable recibirá una notificación para autorizarla.
            </p>
            <ion-button expand="block" (click)="linkPatient()" [disabled]="isLinking" color="warning">
              {{ isLinking ? 'Enviando...' : 'Solicitar vinculación' }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <div class="ap__not-found" *ngIf="searchDone && !foundPatient">
        <ion-icon name="alert-circle-outline" style="font-size: 48px; color: var(--ion-color-warning);"></ion-icon>
        <ion-label style="text-align: center; margin-top: 12px;">
          No se encontró un paciente con ese DNI.
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
      // Busca primero en usuarios titulares
      const user = await this.authService.getUserByDni(+dni);
      if (user && user.firstName) {
        this.foundPatient = { ...user, patientType: 'user' };
        this.searchDone = true;
        this.isSearching = false;
        return;
      }
    } catch {
      // user not found, try dependent search
    }

    try {
      // Si no es usuario, busca en dependientes de grupos familiares
      const dependents = await this.authService.getDependentByDni(dni);
      if (dependents && dependents.length > 0) {
        // Toma el primer resultado; casos con DNI duplicado entre grupos son excepcionales
        this.foundPatient = { ...dependents[0], patientType: 'dependent' };
      }
    } catch {
      // dependent search failed silently
    }

    this.searchDone = true;
    this.isSearching = false;
  }

  async linkPatient() {
    if (!this.foundPatient) return;
    this.isLinking = true;

    const patientId =
      this.foundPatient.patientType === 'dependent'
        ? this.foundPatient.dependentId
        : this.foundPatient.id;

    try {
      await this.patientsService.linkPatient(patientId, this.foundPatient.patientType);

      if (this.foundPatient.patientType === 'dependent') {
        this.toastService.showSuccess(
          'Solicitud enviada. El responsable del grupo recibirá una notificación para autorizar la vinculación.',
        );
      } else {
        this.toastService.showSuccess('Paciente vinculado correctamente');
      }

      this.navController.back();
    } catch (error) {
      const message = error?.error?.message || 'Error al vincular paciente';
      this.toastService.showError(message);
    } finally {
      this.isLinking = false;
    }
  }
}
