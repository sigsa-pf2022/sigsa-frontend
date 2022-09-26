import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { SwiperModule } from 'swiper/angular';
import { SharedComponentsHomeModule } from './components/shared-components-home.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    SharedComponentsHomeModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
