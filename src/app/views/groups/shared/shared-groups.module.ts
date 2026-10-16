import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { GroupItemComponent } from './components/group-item/group-item.component';
import { AvatarModule } from 'src/app/components/avatar/avatar.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [GroupItemComponent],
  imports: [CommonModule, IonicModule, SwiperModule, AvatarModule, PipesModule],
  exports: [GroupItemComponent],

})
export class SharedGroupsModule {}
