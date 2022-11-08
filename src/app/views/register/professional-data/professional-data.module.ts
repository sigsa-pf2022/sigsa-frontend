import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfessionalDataPage } from './professional-data.page';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalDataPage,
  },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [ProfessionalDataPage]
})
export class ProfessionalDataModule {}
