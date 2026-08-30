import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DocumentsService } from '../shared/services/documents.service';
import { MedicalDocument } from '../shared/interfaces/Document.interface';

@Component({
  selector: 'app-view-document',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goBack()"
            aria-label="Volver"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <app-loading-state *ngIf="!document" variant="spinner"></app-loading-state>

      <ng-container *ngIf="document">
        <header class="listing-header">
          <p class="listing-header__eyebrow">Documento médico</p>
          <h1 class="listing-header__title">{{ document.title }}</h1>
        </header>

        <article class="vd__summary">
          <div class="vd__summary-icon" [ngClass]="iconColorClass" aria-hidden="true">
            <ion-icon [name]="getIconByMimeType(document.mimeType)"></ion-icon>
          </div>
          <div class="vd__summary-body">
            <p class="vd__summary-name">{{ document.fileName }}</p>
            <p class="vd__summary-meta">
              <span>{{ document.documentDate | date: 'dd/MM/yyyy' }}</span>
              <span class="vd__dot">·</span>
              <span>{{ formatFileSize(document.fileSize) }}</span>
            </p>
          </div>
        </article>

        <section class="vd__section">
          <div class="section-title vd__section-title">
            <h2>Descripción</h2>
          </div>
          <div class="vd__card vd__card--text">
            <p [class.vd__muted]="!document.description">
              {{ document.description || 'Sin descripción' }}
            </p>
          </div>
        </section>

        <section class="vd__section" *ngIf="fileContent">
          <div class="section-title vd__section-title">
            <h2>Vista previa</h2>
          </div>
          <div class="vd__card vd__card--preview">
            <img
              *ngIf="document.mimeType?.includes('image')"
              [src]="'data:' + document.mimeType + ';base64,' + fileContent"
              class="vd__image"
              [alt]="document.title"
            />
            <iframe
              *ngIf="document.mimeType?.includes('pdf')"
              [src]="pdfUrl"
              class="vd__pdf"
              [title]="document.title"
            ></iframe>
          </div>
        </section>

        <div class="vd__bottom-spacer"></div>
      </ng-container>
    </ion-content>

    <ion-footer class="auth-footer" mode="md" *ngIf="document">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="downloadDocument()"
      >
        <ion-icon name="download" aria-hidden="true"></ion-icon>
        Descargar
      </button>
    </ion-footer>
  `,
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  document: MedicalDocument;
  fileContent: string;
  pdfUrl: any;
  documentId: number;
  groupId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    this.documentId = +this.route.snapshot.paramMap.get('id');
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    await this.loadDocument();
  }

  async loadDocument() {
    this.document = await this.documentsService.getDocument(this.documentId);
    const downloadData = await this.documentsService.downloadDocument(
      this.documentId
    );
    this.fileContent = downloadData.fileContent;

    if (this.document?.mimeType?.includes('pdf')) {
      const blob = this.base64toBlob(this.fileContent, 'application/pdf');
      this.pdfUrl = URL.createObjectURL(blob);
    }
  }

  goBack() {
    // Si venimos del home de un grupo, volvemos ahí y no a la pestaña personal.
    const fallback = this.groupId ? `/groups/home/${this.groupId}` : '/tabs/clipboard';
    this.navController.navigateBack([fallback]);
  }

  getIconByMimeType(mimeType: string): string {
    if (mimeType?.includes('pdf')) {
      return 'document-text';
    } else if (mimeType?.includes('image')) {
      return 'image';
    } else {
      return 'document';
    }
  }

  get iconColorClass(): string {
    const t = this.document?.mimeType || '';
    if (t.includes('image')) return 'vd__summary-icon--image';
    if (t.includes('pdf')) return 'vd__summary-icon--pdf';
    return 'vd__summary-icon--generic';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
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
    if (this.document?.mimeType?.includes('pdf')) {
      link.href = this.pdfUrl;
    } else {
      link.href = `data:${this.document.mimeType};base64,${this.fileContent}`;
    }
    link.download = this.document.fileName;
    link.click();
  }
}
