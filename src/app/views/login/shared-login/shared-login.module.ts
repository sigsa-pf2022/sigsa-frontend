import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { UserValidationModalComponent } from './components/user-validation-modal/user-validation-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule,ReactiveFormsModule, IonicModule, SharedComponentsModule],
  declarations: [UserValidationModalComponent],
  exports: [UserValidationModalComponent],

})
export class SharedLoginModule {}
