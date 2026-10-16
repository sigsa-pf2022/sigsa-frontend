import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedGroupsModule } from '../shared/shared-groups.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { RouterModule, Routes } from '@angular/router';
import { GroupHistoryPage } from './group-history.page';

const routes: Routes = [
  {
    path: '',
    component: GroupHistoryPage
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
  declarations: [GroupHistoryPage],
})
export class GroupHistoryPageModule {}
