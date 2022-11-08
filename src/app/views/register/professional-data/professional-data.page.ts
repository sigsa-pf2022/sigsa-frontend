import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalsService } from '../../doctors/shared/services/professionals.service';

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
        <ion-input class="ui-form-input" formControlName="firstName" placeholder="Nombre"> </ion-input>
        <ion-input class="ui-form-input" formControlName="lastName" placeholder="Apellido"> </ion-input>
        <ion-input class="ui-form-input" formControlName="field" placeholder="Especialidad"> </ion-input>
        <ion-input class="ui-form-input" formControlName="clinic" placeholder="Clinica"> </ion-input>
        <ion-input class="ui-form-input" formControlName="streetName" placeholder="Calle"> </ion-input>
        <ion-input class="ui-form-input" formControlName="streetNumber" placeholder="Altura"> </ion-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>`,
  styleUrls: ['./professional-data.page.scss'],
})
export class ProfessionalDataPage implements OnInit {
  form = this.fb.group({
    firstName: '',
    lastName: '',
    field: '',
    clinic: '',
    streetName: '',
    streetNumber: null,
  });
  constructor(
    private fb: FormBuilder,
    private professionalsService: ProfessionalsService,
    private toastService: ToastService,
    private navController: NavController
  ) {}

  ngOnInit() {}

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
