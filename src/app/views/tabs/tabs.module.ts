import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from '../home/home.page';
import { SwiperModule } from 'swiper/angular';
import { NewGroupPage } from '../new-group/new-group.page';

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
        path:'new-group',
        component: NewGroupPage
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
    SwiperModule
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
