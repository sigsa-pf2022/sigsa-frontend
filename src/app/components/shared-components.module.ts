import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendVerificationEmailModalComponent } from './send-verification-email-modal/send-verification-email-modal.component';
import { SuccessCreationAcountComponent } from './success-creation-acount/success-creation-acount.component';
import { RecoveryPasswordModalComponent } from './recovery-password-modal/recovery-password-modal.component';
@NgModule({
  declarations: [SendVerificationEmailModalComponent, SuccessCreationAcountComponent,RecoveryPasswordModalComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [SendVerificationEmailModalComponent, SuccessCreationAcountComponent,RecoveryPasswordModalComponent],
})
export class SharedComponentsModule {}
