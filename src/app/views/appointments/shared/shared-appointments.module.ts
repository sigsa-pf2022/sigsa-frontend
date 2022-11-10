import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsItemListComponent } from './components/appointments-item-list/appointments-item-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AppointmentsItemListComponent],
  imports: [CommonModule, IonicModule],
  exports: [AppointmentsItemListComponent],
})
export class SharedAppointmentsModule {}
