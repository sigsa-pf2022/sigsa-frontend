import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { GeographyService } from 'src/app/services/geography/geography.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';
import { RegisterFormDataService } from '../shared-register/services/register-form-data/register-form-data.service';

@Component({
  selector: 'app-professional-data',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/register/personal-data"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo Profesional</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="pd">
      <ion-img class="pd__img" src="assets/images/doctors/new-doctor.svg"></ion-img>
      <form class="pd__form" [formGroup]="form">
        <ion-input class="ui-form-input" formControlName="licenseNumber" placeholder="Numero de licencia"> </ion-input>
        <ion-select
          class="ui-form-input"
          placeholder="Provincias con jurisdiccion"
          [multiple]="true"
          formControlName="jurisdiction"
        >
          <ion-select-option *ngFor="let state of this.states" [value]="state">{{ state.name }}</ion-select-option>
        </ion-select>
        <ion-select
          class="ui-form-input"
          placeholder="Especialidades"
          [multiple]="true"
          formControlName="specialization"
        >
          <ion-select-option *ngFor="let specialization of this.specializations" [value]="specialization">{{
            specialization.name
          }}</ion-select-option>
        </ion-select>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" color="primary"> Siguiente </ion-button>
    </ion-footer>`,
  styleUrls: ['./professional-data.page.scss'],
})
export class ProfessionalDataPage {
  states = [];
  specializations = [];
  form = this.fb.group({
    specialization: [null, Validators.required],
    licenseNumber: [null, Validators.required],
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
    this.states = await this.geographyService.getStates();
    this.specializations = await this.professionalsService.getProfessionalsSpecializations();
  }

  async onSubmit() {
    this.registerFormDataService.setData(this.form.value);
    this.navController.navigateForward('/register/user-data');
  }
}
