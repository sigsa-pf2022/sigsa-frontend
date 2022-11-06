import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewGroupPage } from './new-group.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedGroupsModule } from '../shared/shared-groups.module';

const routes: Routes = [
  {
    path: '',
    component: NewGroupPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedGroupsModule,
  ],
  declarations: [NewGroupPage],
})
export class NewGroupPageModule {}
