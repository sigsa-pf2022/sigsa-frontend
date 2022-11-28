import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppointmentsPage } from './appointments.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { PickProfessionalPage } from './pick-professional/pick-professional.page';
import { RouterModule, Routes } from '@angular/router';
import { CreateAppointmentPage } from './create-appointment/create-appointment.page';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedAppointmentsModule } from './shared/shared-appointments.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DoctorsPage } from '../doctors/doctors.page';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';

const routes: Routes = [

  {
    path: 'create/pick-doctor',
    component: PickProfessionalPage,
  },
  {
    path: 'create/appointment',
    component: CreateAppointmentPage,
  },
  {
    path: 'create/my-doctors',
    component: DoctorsPage,
  },
  {
    path: 'edit/:id/pick-doctor',
    component: PickProfessionalPage,
  },
  {
    path: 'edit/:id/appointment',
    component: CreateAppointmentPage,
  },
  {
    path: 'edit/:id/my-doctors',
    component: DoctorsPage,
  },
  {
    path: 'view/:id',
    component: ViewAppointmentComponent,
  },
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
  declarations: [AppointmentsPage, PickProfessionalPage, CreateAppointmentPage, ViewAppointmentComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],

})
export class AppointmentsPageModule {}
