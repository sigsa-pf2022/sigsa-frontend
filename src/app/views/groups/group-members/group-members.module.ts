import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedGroupsModule } from '../shared/shared-groups.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { RouterModule, Routes } from '@angular/router';
import { GroupMembersPage } from './group-members.page';

const routes: Routes = [
  {
    path: '',
    component: GroupMembersPage
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    SharedGroupsModule,
    SharedComponentsModule,
  ],
  declarations: [GroupMembersPage],

})
export class GroupMembersPageModule {}
