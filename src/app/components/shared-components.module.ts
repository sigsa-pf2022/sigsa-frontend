import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendVerificationEmailModalComponent } from './send-verification-email-modal/send-verification-email-modal.component';

@NgModule({
  declarations: [SendVerificationEmailModalComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [SendVerificationEmailModalComponent],
})
export class SharedComponentsModule {}
