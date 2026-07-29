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
import { SwiperModule } from 'swiper/angular';
import { ItemsListComponent } from './items-list/items-list.component';
import { MenuComponent } from './menu/menu.component';
import { EmptyEventCardComponent } from './empty-event-card/empty-event-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppointmentsItemListComponent } from './appointments-item-list/appointments-item-list.component';
import { YesNoModalComponent } from './yes-no-modal/yes-no-modal.component';
import { MedsEventsItemListComponent } from './meds-event-item-list/meds-event-item-list.component';
import { SharedDocumentsModule } from '../views/documents/shared/shared-documents.module';
import { AvatarComponent } from './avatar/avatar.component';

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
    ItemsListComponent,
    MenuComponent,
    EmptyEventCardComponent,
    AppointmentsItemListComponent,
    YesNoModalComponent,
    MedsEventsItemListComponent,
    AvatarComponent
  ],
  imports: [SwiperModule, CommonModule, IonicModule, FormsModule, ReactiveFormsModule, ScrollingModule, SharedDocumentsModule],
  exports: [
    HeaderComponent,
    SendVerificationEmailModalComponent,
    SuccessCreationAcountComponent,
    RecoveryPasswordModalComponent,
    PasswordInputComponent,
    EventCardComponent,
    RemindersComponent,
    NextEventsComponent,
    ItemsListComponent,
    MenuComponent,
    EmptyEventCardComponent,
    AppointmentsItemListComponent,
    YesNoModalComponent,
    MedsEventsItemListComponent,
    AvatarComponent
  ],
})
export class SharedComponentsModule {}
