import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendVerificationEmailModalComponent } from './send-verification-email-modal/send-verification-email-modal.component';
import { SuccessCreationAcountComponent } from './success-creation-acount/success-creation-acount.component';
@NgModule({
  declarations: [SendVerificationEmailModalComponent, SuccessCreationAcountComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [SendVerificationEmailModalComponent, SuccessCreationAcountComponent],
})
export class SharedComponentsModule {}
