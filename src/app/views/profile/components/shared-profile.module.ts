import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileItemComponent } from './profile-item/profile-item.component';

@NgModule({
  declarations: [ProfileItemComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [ProfileItemComponent],
})
export class SharedProfileComponentsModule {}
