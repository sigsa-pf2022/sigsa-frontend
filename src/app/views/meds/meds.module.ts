import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedsPage } from './meds.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedAppointmentsModule } from '../appointments/shared/shared-appointments.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PickMedComponent } from './pick-med/pick-med.component';
import { CreateMedEventComponent } from './create-med-event/create-med-event.component';

const routes: Routes = [
  {
    path: 'create/pick-med',
    component: PickMedComponent,
  },
  {
    path: 'create/med',
    component: CreateMedEventComponent,
  },
  // {
  //   path: 'create/my-doctors',
  //   component: DoctorsPage,
  // },
  // {
  // path: 'edit/:id/pick-doctor',
  // component: PickMedComponent,
  // },
  // {
  //   path: 'edit/:id/appointment',
  //   component: CreateAppointmentPage,
  // },
  // {
  //   path: 'edit/:id/my-doctors',
  //   component: DoctorsPage,
  // },
  // {
  //   path: 'view/:id',
  //   component: ViewAppointmentComponent,
  // },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedComponentsModule,
    SharedAppointmentsModule,
    ScrollingModule,
  ],
  declarations: [MedsPage, PickMedComponent, CreateMedEventComponent],
})
export class MedsPageModule {}
