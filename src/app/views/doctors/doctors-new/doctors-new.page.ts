import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalsService } from '../shared/services/professionals.service';

@Component({
  selector: 'app-doctors-new',
  template: ` <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/doctors"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo Profesional</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="dn">
      <ion-img class="dn__img" src="assets/images/doctors/new-doctor.svg"></ion-img>
      <form class="dn__form" [formGroup]="form">
        <ion-input class="ui-form-input" formControlName="firstName" placeholder="Nombre"> </ion-input>
        <ion-input class="ui-form-input" formControlName="lastName" placeholder="Apellido"> </ion-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>`,
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
