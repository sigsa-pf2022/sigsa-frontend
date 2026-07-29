import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { MyDataPage } from './my-data/my-data.page';
import { SharedProfileComponentsModule } from './components/shared-profile.module';
import { RouterModule, Routes } from '@angular/router';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'my-data',
    component: MyDataPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedProfileComponentsModule
  ],
  declarations: [ProfilePage, MyDataPage],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }]
})
export class ProfilePageModule {}
