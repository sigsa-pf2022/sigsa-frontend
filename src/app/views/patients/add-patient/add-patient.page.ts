import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PatientsService } from '../shared/services/patients.service';

@Component({
  selector: 'app-add-patient',
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

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Profesional</p>
        <h1 class="listing-header__title">Agregar paciente</h1>
      </header>

      <div class="ap__container">
        <form class="auth-form ap__search-form" [formGroup]="searchForm">
          <div class="auth-field">
            <label class="auth-field__label" for="ap-dni">DNI del paciente</label>
            <div class="auth-input">
              <ion-input
                id="ap-dni"
                formControlName="dni"
                placeholder="Sin puntos ni espacios"
                type="text"
                inputmode="numeric"
                (keyup.enter)="searchPatient()"
              ></ion-input>
            </div>
            <p class="auth-field__error" *ngIf="searchForm.get('dni')?.touched && searchForm.get('dni')?.invalid">
              <ng-container *ngIf="searchForm.get('dni')?.hasError('pattern')">El DNI solo puede contener números.</ng-container>
              <ng-container *ngIf="!searchForm.get('dni')?.hasError('pattern')">El DNI debe tener al menos 7 dígitos.</ng-container>
            </p>
            <p class="auth-field__hint">
              Buscamos primero entre titulares; si no, en dependientes de grupos familiares.
            </p>
          </div>

          <button
            type="button"
            class="auth-btn auth-btn--primary"
            (click)="searchPatient()"
            [disabled]="searchForm.invalid || isSearching"
          >
            <ion-icon name="search" aria-hidden="true"></ion-icon>
            {{ isSearching ? 'Buscando...' : 'Buscar' }}
          </button>
        </form>

        <article class="ap__result-card" *ngIf="foundPatient && foundPatient.patientType === 'user'">
          <div class="ap__result-head">
            <div class="ap__result-avatar" aria-hidden="true">
              {{ getInitials(foundPatient.firstName, foundPatient.lastName) }}
            </div>
            <div class="ap__result-info">
              <span class="status-badge status-badge--violet">Titular</span>
              <p class="ap__result-name">{{ foundPatient.firstName | titlecase }} {{ foundPatient.lastName | titlecase }}</p>
              <p class="ap__result-meta">DNI: {{ foundPatient.dni }}</p>
            </div>
          </div>
          <button
            type="button"
            class="auth-btn auth-btn--primary"
            (click)="linkPatient()"
            [disabled]="isLinking"
          >
            {{ isLinking ? 'Vinculando...' : 'Vincular paciente' }}
          </button>
        </article>

        <article class="ap__result-card" *ngIf="foundPatient && foundPatient.patientType === 'dependent'">
          <div class="ap__result-head">
            <div class="ap__result-avatar" aria-hidden="true">
              {{ getInitials(foundPatient.dependentFirstName, foundPatient.dependentLastName) }}
            </div>
            <div class="ap__result-info">
              <span class="status-badge status-badge--warning">Dependiente</span>
              <p class="ap__result-name">
                {{ foundPatient.dependentFirstName | titlecase }} {{ foundPatient.dependentLastName | titlecase }}
              </p>
              <p class="ap__result-meta">DNI: {{ foundPatient.dependentDni }}</p>
            </div>
          </div>

          <div class="ap__notice">
            <ion-icon name="information-circle" aria-hidden="true"></ion-icon>
            <p>
              Pertenece al grupo <strong>{{ foundPatient.groupName | titlecase }}</strong>, administrado por
              <strong>{{ foundPatient.responsibleFirstName | titlecase }} {{ foundPatient.responsibleLastName | titlecase }}</strong>.
              El responsable va a recibir una notificación para autorizar la solicitud.
            </p>
          </div>

          <button
            type="button"
            class="auth-btn auth-btn--primary"
            (click)="linkPatient()"
            [disabled]="isLinking"
          >
            {{ isLinking ? 'Enviando...' : 'Solicitar vinculación' }}
          </button>
        </article>

        <div class="empty-state" *ngIf="searchDone && !foundPatient" role="status">
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="alert-circle"></ion-icon>
          </div>
          <h2 class="empty-state__title">No encontramos a esa persona</h2>
          <p class="empty-state__subtitle">
            Revisá el DNI y probá de nuevo. Si la persona no tiene cuenta todavía, pedile que se registre primero.
          </p>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {
  searchForm = this.fb.group({
    dni: ['', [Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(7)])]],
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

  goBack() {
    this.navController.navigateBack(['/patients']);
  }

  getInitials(first: string, last: string): string {
    const f = (first ?? '').trim();
    const l = (last ?? '').trim();
    return ((f[0] || '') + (l[0] || '')).toUpperCase() || '?';
  }

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
