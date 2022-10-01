import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { GroupItemComponent } from './group-item/group-item.component';

@NgModule({
  declarations: [GroupItemComponent],
  imports: [CommonModule, IonicModule, SwiperModule],
  exports: [GroupItemComponent],
})
export class SharedComponentsGroupsModule {}
