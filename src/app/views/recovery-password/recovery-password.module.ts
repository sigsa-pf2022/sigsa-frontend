import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

const routes: Routes = [
  {
    path: 'password-reset',
    loadChildren: () => import('./password-reset/password-reset.module').then((m) => m.PasswordResetModule),
  },
  {
    path: 'token-verification',
    loadChildren: () => import('./token-verification/token-verification.module').then((m) => m.TokenVerificationModule),
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
  ],
  declarations: [],
})
export class RecoveryPasswordModule {}
