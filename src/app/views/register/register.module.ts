import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'personal-data',
        loadChildren: () =>
          import('./personal-data/personal-data.module').then(
            (m) => m.PersonalDataModule
          ),
      },
      {
        path: 'user-data',
        loadChildren: () =>
          import('./user-data/user-data.module').then((m) => m.UserDataModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
})
export class RegisterModule {}
