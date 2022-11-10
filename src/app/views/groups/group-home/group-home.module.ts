import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupHomePage } from './group-home.page';
import { SharedGroupsModule } from '../shared/shared-groups.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':id',
    component: GroupHomePage,
  },
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
  declarations: [GroupHomePage],

})
export class GroupHomePageModule {}
