import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupsPage } from './groups.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedGroupsModule } from './shared/shared-groups.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../../views/groups/group-home/group-home.module').then((m) => m.GroupHomePageModule),
  },
  {
    path: 'create',
    loadChildren: () => import('../../views/groups/new-group/new-group.module').then((m) => m.NewGroupPageModule),
  },
  {
    path: 'add-members',
    loadChildren: () => import('../../views/groups/add-members/add-members.module').then((m) => m.AddMembersModule),
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
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  declarations: [GroupsPage],
})
export class GroupsModule {}
