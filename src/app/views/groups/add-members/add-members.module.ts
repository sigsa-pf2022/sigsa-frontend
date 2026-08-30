import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AddMembersPage } from './add-members.page';
import { AvatarModule } from 'src/app/components/avatar/avatar.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
const routes: Routes = [
  {
    path: '',
    component: AddMembersPage,
  },
];
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes), AvatarModule, SharedComponentsModule],
  declarations: [AddMembersPage],
})
export class AddMembersModule {}
