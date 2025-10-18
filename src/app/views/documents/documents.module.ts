import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DocumentsPage } from './documents.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedDocumentsModule } from './shared/shared-documents.module';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { CreateDocumentPage } from './create-document/create-document.page';

const routes: Routes = [
  {
    path: 'create',
    component: CreateDocumentPage,
  },
  {
    path: 'edit/:id',
    component: CreateDocumentPage,
  },
  {
    path: 'view/:id',
    component: ViewDocumentComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedComponentsModule,
    SharedDocumentsModule,
    ScrollingModule,
  ],
  declarations: [DocumentsPage, CreateDocumentPage, ViewDocumentComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
})
export class DocumentsPageModule {}
