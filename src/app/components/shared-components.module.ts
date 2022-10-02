import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendVerificationEmailModalComponent } from './send-verification-email-modal/send-verification-email-modal.component';
import { SuccessCreationAcountComponent } from './success-creation-acount/success-creation-acount.component';
import { RecoveryPasswordModalComponent } from './recovery-password-modal/recovery-password-modal.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { HeaderComponent } from './header/header.component';
import { EventCardComponent } from './event-card/event-card.component';
import { RemindersComponent } from './reminders/reminders.component';
import { NextEventsComponent } from './next-events/next-events.component';
@NgModule({
  declarations: [
    HeaderComponent,
    SendVerificationEmailModalComponent,
    SuccessCreationAcountComponent,
    RecoveryPasswordModalComponent,
    PasswordInputComponent,
    EventCardComponent,
    RemindersComponent,
    NextEventsComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [
    HeaderComponent,
    SendVerificationEmailModalComponent,
    SuccessCreationAcountComponent,
    RecoveryPasswordModalComponent,
    PasswordInputComponent,
    EventCardComponent,
    RemindersComponent,
    NextEventsComponent,
  ],
})
export class SharedComponentsModule {}
