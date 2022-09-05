import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupsPage } from './groups.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SwiperModule } from 'swiper/angular';

const routes: Routes = [
  {
    path: '',
    component: GroupsPage,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    SwiperModule,
  ],
  declarations: [GroupsPage],
})
export class HomePageModule {}

