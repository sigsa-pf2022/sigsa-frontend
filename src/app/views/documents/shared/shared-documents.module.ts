import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DocumentItemListComponent } from './components/document-item-list/document-item-list.component';

// DocumentsService NO se declara acá: ya es `providedIn: 'root'`. Si se lo
// agrega a `providers`, este módulo lazy crea una instancia aparte (con su
// propio Subject), y la página de creación y la del listado dejan de compartir
// estado. Igual que AppointmentsService, debe ser un único singleton root.
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [DocumentItemListComponent],
  exports: [DocumentItemListComponent],
})
export class SharedDocumentsModule {}
