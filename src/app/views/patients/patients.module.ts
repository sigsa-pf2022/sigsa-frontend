import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDocumentsModule } from '../documents/shared/shared-documents.module';
import { PatientsPage } from './patients.page';
import { AddPatientPage } from './add-patient/add-patient.page';
import { PatientDetailPage } from './patient-detail/patient-detail.page';
import { AgendaPage } from './agenda/agenda.page';

const routes: Routes = [
  {
    path: '',
    component: PatientsPage,
  },
  {
    path: 'add',
    component: AddPatientPage,
  },
  // Antes que ':patientId', o el comodín se la come.
  {
    path: 'agenda',
    component: AgendaPage,
  },
  {
    path: ':patientId',
    component: PatientDetailPage,
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
    SharedDocumentsModule,
  ],
  declarations: [PatientsPage, AddPatientPage, PatientDetailPage, AgendaPage],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
})
export class PatientsPageModule {}
