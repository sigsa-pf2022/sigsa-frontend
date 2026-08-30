import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { GeographyService } from 'src/app/services/geography/geography.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';
import { RegisterFormDataService } from '../shared-register/services/register-form-data/register-form-data.service';

@Component({
  selector: 'app-professional-data',
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

          <div class="auth-stepper" aria-label="Paso 2 de 3">
            <div class="auth-stepper__bar auth-stepper__bar--done"></div>
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <div class="auth-stepper__bar"></div>
            <span class="auth-stepper__count">2/3</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="auth">
      <div class="auth-container">
        <div class="auth-hero" aria-hidden="true">
          <ion-icon name="medkit" class="prof__hero-icon"></ion-icon>
        </div>

        <div class="auth-header">
          <p class="auth-header__eyebrow">Crear cuenta</p>
          <h1 class="auth-header__title">Datos profesionales</h1>
          <p class="auth-header__subtitle">
            Contanos sobre tu matrícula, jurisdicción y especialidades.
          </p>
        </div>

        <app-loading-state *ngIf="isLoading" variant="spinner"></app-loading-state>

        <form class="auth-form" [formGroup]="form" *ngIf="!isLoading">
          <div class="auth-field">
            <label class="auth-field__label" for="prof-license">Número de licencia</label>
            <div class="auth-input">
              <ion-input
                id="prof-license"
                formControlName="licenseNumber"
                placeholder="Ej: 12345"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="prof-jurisdiction">Provincias con jurisdicción</label>
            <div class="auth-input">
              <ion-select
                id="prof-jurisdiction"
                placeholder="Seleccioná una o más"
                [multiple]="true"
                formControlName="jurisdiction"
                okText="Confirmar"
                cancelText="Cancelar"
              >
                <ion-select-option *ngFor="let state of this.states" [value]="state">{{ state.name }}</ion-select-option>
              </ion-select>
            </div>
            <p class="auth-field__hint">Podés seleccionar varias provincias.</p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="prof-specialization">Especialidades</label>
            <div class="auth-input">
              <ion-select
                id="prof-specialization"
                placeholder="Seleccioná una o más"
                [multiple]="true"
                formControlName="specialization"
                okText="Confirmar"
                cancelText="Cancelar"
              >
                <ion-select-option *ngFor="let specialization of this.specializations" [value]="specialization">{{
                  specialization.name
                }}</ion-select-option>
              </ion-select>
            </div>
          </div>
        </form>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
        [disabled]="!this.form.valid"
      >
        Siguiente
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./professional-data.page.scss'],
})
export class ProfessionalDataPage {
  states = [];
  specializations = [];
  /** Los dos ion-select se veían vacíos hasta que resolvían ambas requests. */
  isLoading = true;
  form = this.fb.group({
    specialization: [null],
    licenseNumber: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
    jurisdiction: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private professionalsService: ProfessionalsService,
    private navController: NavController,
    private registerFormDataService: RegisterFormDataService,
    private geographyService: GeographyService
  ) {}

  async ionViewWillEnter() {
    this.isLoading = this.states.length === 0;
    try {
      // Son independientes: en paralelo el spinner dura la mitad.
      const [states, specializations] = await Promise.all([
        this.geographyService.getStates(),
        this.professionalsService.getProfessionalsSpecializations(),
      ]);
      this.states = states;
      this.specializations = specializations;
    } catch (error) {
      console.error('ProfessionalDataPage: error cargando provincias y especialidades', error);
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.navController.navigateBack(['/register/personal-data']);
  }

  async onSubmit() {
    this.registerFormDataService.setData(this.form.value);
    this.navController.navigateForward('/register/user-data');
  }
}
