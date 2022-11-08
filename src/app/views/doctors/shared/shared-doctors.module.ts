import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DoctorsListComponent],
  imports: [CommonModule, IonicModule],
  exports: [DoctorsListComponent],
})
export class SharedDoctorsModule {}
