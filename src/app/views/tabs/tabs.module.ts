import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from '../home/home.page';
import { SwiperModule } from 'swiper/angular';
import { SharedComponentsHomeModule } from '../home/components/shared-components-home.module';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path:'home',
        component: HomePage
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ]
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SwiperModule,
    SharedComponentsHomeModule
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
