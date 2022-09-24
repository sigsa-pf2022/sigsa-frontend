import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewGroupPage } from './new-group.page';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NewGroupPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [NewGroupPage]
})
export class NewGroupPageModule {}
