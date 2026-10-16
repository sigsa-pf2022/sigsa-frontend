import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from './avatar.component';

/**
 * El avatar vive en su propio módulo, y no sólo en SharedComponentsModule,
 * porque lo necesitan módulos chicos (perfil, group-item, add-members) que no
 * importan todo el módulo compartido.
 */
@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, IonicModule],
  exports: [AvatarComponent],
})
export class AvatarModule {}
