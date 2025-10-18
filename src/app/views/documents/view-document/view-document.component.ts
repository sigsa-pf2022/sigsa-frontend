import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DocumentsService } from '../shared/services/documents.service';
import { MedicalDocument } from '../shared/interfaces/Document.interface';

@Component({
  selector: 'app-view-document',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/clipboard"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Documento Médico</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="vd" *ngIf="document">
      <div class="vd__header">
        <ion-icon
          [name]="getIconByMimeType(document.mimeType)"
          class="vd__header__icon"
        ></ion-icon>
        <h2 class="vd__header__title">{{ document.title }}</h2>
        <p class="vd__header__date">{{ document.documentDate | date: 'dd/MM/yyyy' }}</p>
      </div>
      <div class="vd__info">
        <ion-list lines="none">
          <ion-item>
            <ion-label>
              <p>Descripción</p>
              <h3>{{ document.description || 'Sin descripción' }}</h3>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>Nombre del archivo</p>
              <h3>{{ document.fileName }}</h3>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>Tamaño</p>
              <h3>{{ formatFileSize(document.fileSize) }}</h3>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
      <div class="vd__preview" *ngIf="fileContent">
        <ion-label class="vd__preview__title">Vista previa</ion-label>
        <img
          *ngIf="document.mimeType.includes('image')"
          [src]="'data:' + document.mimeType + ';base64,' + fileContent"
          class="vd__preview__image"
        />
        <iframe
          *ngIf="document.mimeType.includes('pdf')"
          [src]="pdfUrl"
          class="vd__preview__pdf"
        ></iframe>
      </div>
    </ion-content>
    <ion-footer class="footer__light" *ngIf="document">
      <ion-button (click)="downloadDocument()" expand="block" color="primary">
        Descargar
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  document: MedicalDocument;
  fileContent: string;
  pdfUrl: any;
  documentId: number;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    this.documentId = +this.route.snapshot.paramMap.get('id');
    await this.loadDocument();
  }

  async loadDocument() {
    this.document = await this.documentsService.getDocument(this.documentId);
    const downloadData = await this.documentsService.downloadDocument(
      this.documentId
    );
    this.fileContent = downloadData.fileContent;

    if (this.document.mimeType.includes('pdf')) {
      const blob = this.base64toBlob(this.fileContent, 'application/pdf');
      this.pdfUrl = URL.createObjectURL(blob);
    }
  }

  getIconByMimeType(mimeType: string): string {
    if (mimeType.includes('pdf')) {
      return 'document-text';
    } else if (mimeType.includes('image')) {
      return 'image';
    } else {
      return 'document';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }

  base64toBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  downloadDocument() {
    const link = document.createElement('a');
    if (this.document.mimeType.includes('pdf')) {
      link.href = this.pdfUrl;
    } else {
      link.href = `data:${this.document.mimeType};base64,${this.fileContent}`;
    }
    link.download = this.document.fileName;
    link.click();
  }
}
