import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppointmentsPage } from './appointments.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { AppointmentsNewPage } from './appointments-new/appointments-new.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage,
  },
  {
    path: 'new',
    component: AppointmentsNewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, ReactiveFormsModule, IonicModule, SharedComponentsModule],
  declarations: [AppointmentsPage, AppointmentsNewPage],
})
export class AppointmentsPageModule {}
