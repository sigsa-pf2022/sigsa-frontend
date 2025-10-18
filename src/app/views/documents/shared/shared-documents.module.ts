import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DocumentsService } from './services/documents.service';

@NgModule({
  imports: [CommonModule, IonicModule],
  providers: [DocumentsService],
  exports: [],
})
export class SharedDocumentsModule {}
