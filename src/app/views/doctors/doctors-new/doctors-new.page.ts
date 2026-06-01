import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalsService } from '../shared/services/professionals.service';

@Component({
  selector: 'app-doctors-new',
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
        <p class="listing-header__eyebrow">Tus profesionales</p>
        <h1 class="listing-header__title">Nuevo profesional</h1>
      </header>

      <div class="dn__container">
        <div class="auth-hero" aria-hidden="true">
          <ion-icon name="medkit" class="dn__hero-icon"></ion-icon>
        </div>

        <p class="dn__caption">
          Agregá un profesional de confianza para registrar turnos y compartir documentos.
        </p>

        <form class="auth-form dn__form" [formGroup]="form">
          <div class="auth-field">
            <label class="auth-field__label" for="dn-firstname">Nombre</label>
            <div class="auth-input">
              <ion-input
                id="dn-firstname"
                formControlName="firstName"
                placeholder="Ej: Lucía"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="dn-lastname">Apellido</label>
            <div class="auth-input">
              <ion-input
                id="dn-lastname"
                formControlName="lastName"
                placeholder="Ej: Fernández"
                type="text"
                autocapitalize="words"
              ></ion-input>
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
        Guardar profesional
      </button>
    </ion-footer>
  `,
  styleUrls: ['./doctors-new.page.scss'],
})
export class DoctorsNewPage implements OnInit {
  form = this.fb.group({
    firstName: '',
    lastName: '',
  });
  constructor(
    private fb: FormBuilder,
    private professionalsService: ProfessionalsService,
    private toastService: ToastService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  goBack() {
    this.navController.navigateBack(['/doctors']);
  }

  onSubmit() {
    return this.professionalsService.createMyProfessional(this.form.value).then(() => {
      this.successCreation();
    });
  }

  successCreation() {
    this.toastService.showSuccess('Profesional creado correctamente.');
    this.navController.pop();
  }
}
