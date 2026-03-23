import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DocumentsService } from './services/documents.service';
import { DocumentItemListComponent } from './components/document-item-list/document-item-list.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [DocumentItemListComponent],
  providers: [DocumentsService],
  exports: [DocumentItemListComponent],
})
export class SharedDocumentsModule {}
