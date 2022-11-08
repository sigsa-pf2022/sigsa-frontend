import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DoctorsPage } from './doctors.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { DoctorsNewPage } from './doctors-new/doctors-new.page';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: DoctorsPage,
  },
  {
    path: 'new',
    component: DoctorsNewPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedComponentsModule,
  ],
  declarations: [DoctorsPage,DoctorsNewPage],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],

})
export class DoctorsPageModule {}
