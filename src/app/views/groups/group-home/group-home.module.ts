import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupHomePage } from './group-home.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsGroupsModule } from '../components/shared-components-group.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
const routes: Routes = [
  {
    path: '',
    component: GroupHomePage,
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsGroupsModule,
    SharedComponentsModule
  ],
  declarations: [GroupHomePage],
})
export class GroupHomePageModule {}
