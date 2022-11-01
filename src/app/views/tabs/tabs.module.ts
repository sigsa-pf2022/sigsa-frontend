import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from '../home/home.page';
import { GroupsPage } from '../groups/groups.page';
import { SwiperModule } from 'swiper/angular';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { AppointmentsPage } from '../appointments/appointments.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: HomePage,
      },
      {
        path: 'groups',
        component: GroupsPage,
      },
      {
        path: 'appointment',
        component: AppointmentsPage,
      },
    ],
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    SharedComponentsModule,
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
