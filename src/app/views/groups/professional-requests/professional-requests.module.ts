import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { ProfessionalRequestsPage } from './professional-requests.page';

const routes: Routes = [
  // Sin grupo: todas las del usuario (las suyas como titular y las de sus grupos).
  { path: '', component: ProfessionalRequestsPage },
  { path: ':groupId', component: ProfessionalRequestsPage },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
  ],
  declarations: [ProfessionalRequestsPage],
})
export class ProfessionalRequestsPageModule {}
