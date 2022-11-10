import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Professional } from './shared/interfaces/Professional.interface';
import { ProfessionalsService } from './shared/services/professionals.service';

@Component({
  selector: 'app-doctors',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profile"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Mis Profesionales</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="drs">
      <form [formGroup]="this.searchForm">
        <ion-input class="ui-form-input drs__search" placeholder="Buscar doctor ..." formControlName="input">
          <ion-icon class="drs__search__icon" name="search"></ion-icon>
        </ion-input>
      </form>
      <ion-list class="drs__list" *ngIf="this.doctors.length>0">
        <app-items-list
          *ngFor="let doctor of this.doctors"
          [title]="doctor.firstName + ' ' + doctor.lastName"
          [subtitle]="doctor.field"
          img="doctor"
        ></app-items-list>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="newDoctor()" class="drs__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {
  searchForm = this.fb.group({ input: '' });
  doctors: Professional[] = [];
  constructor(
    private navController: NavController,
    private fb: FormBuilder,
    private professionalsService: ProfessionalsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.professionalsService.getMyProfessionals().then((res: Professional[]) => (this.doctors = res));
  }
  newDoctor() {
    return this.navController.navigateForward(['/doctors/new']);
  }
}
