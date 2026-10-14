import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { ToastService } from 'src/app/services/toast/toast.service';
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
              *ngIf="isPdf && pdfUrl"
              [src]="pdfUrl"
              class="vd__pdf"
              [title]="document.title"
            ></iframe>
            <!-- El WebView de Android no dibuja PDFs en un iframe: se abre con
                 el visor del sistema. -->
            <div class="vd__pdf-native" *ngIf="isPdf && isNative">
              <ion-icon name="document-text" aria-hidden="true"></ion-icon>
              <p>La vista previa del PDF se abre en el visor de tu teléfono.</p>
              <button
                type="button"
                class="auth-btn auth-btn--secondary"
                (click)="openPdf()"
                [disabled]="opening"
              >
                <ion-spinner *ngIf="opening" name="crescent"></ion-spinner>
                <ion-icon *ngIf="!opening" name="open-outline" aria-hidden="true"></ion-icon>
                Abrir PDF
              </button>
            </div>
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
        [disabled]="downloading || !fileContent"
      >
        <ion-spinner *ngIf="downloading" name="crescent"></ion-spinner>
        <ion-icon *ngIf="!downloading" name="download" aria-hidden="true"></ion-icon>
        Descargar
      </button>
    </ion-footer>
  `,
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit, OnDestroy {
  document: MedicalDocument;
  fileContent: string;
  /** Sólo en el navegador: en el teléfono el PDF se abre con el visor del sistema. */
  pdfUrl: SafeResourceUrl | null = null;
  readonly isNative = Capacitor.isNativePlatform();
  opening = false;
  documentId: number;
  groupId: string | null = null;
  returnUrl: string | null = null;
  downloading = false;
  private blobUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private toastService: ToastService,
    private navController: NavController,
    private sanitizer: DomSanitizer
  ) {}

  get isPdf(): boolean {
    return !!this.document?.mimeType?.includes('pdf');
  }

  ngOnDestroy() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  async ngOnInit() {
    this.documentId = +this.route.snapshot.paramMap.get('id');
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    await this.loadDocument();
  }

  async loadDocument() {
    this.document = await this.documentsService.getDocument(this.documentId);
    const downloadData = await this.documentsService.downloadDocument(
      this.documentId
    );
    this.fileContent = downloadData.fileContent;

    if (this.isPdf && !this.isNative) {
      const blob = this.base64toBlob(this.fileContent, 'application/pdf');
      this.blobUrl = URL.createObjectURL(blob);
      // Angular bloquea en un iframe cualquier URL que no se marque como segura
      // (NG0904) y la vista previa quedaba en blanco. Es un blob que armamos
      // nosotros con el contenido del documento, no una URL externa.
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
    }
  }

  goBack() {
    // `returnUrl` lo manda quien abre el documento desde una pantalla que no es
    // la propia (por ejemplo la ficha de documentos de un paciente). Si no
    // viene, se cae al grupo y por último a la pestaña personal.
    if (this.returnUrl) {
      this.navController.navigateBack(this.returnUrl);
      return;
    }
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

  /**
   * En el teléfono el `<a download>` no hace nada: el WebView de Capacitor no
   * atiende descargas, así que el toque se perdía sin error. Ahí se escribe el
   * archivo en la carpeta pública Documentos. En el navegador el link sí anda.
   */
  async downloadDocument() {
    if (!Capacitor.isNativePlatform()) {
      this.downloadInBrowser();
      return;
    }
    if (this.downloading || !this.fileContent) return;

    this.downloading = true;
    // Una barra en el nombre se tomaría como carpeta.
    const fileName = (this.document.fileName || `documento-${this.documentId}`).replace(/[\\/]/g, '-');
    try {
      // Sólo pide algo en Android 10 o anterior; desde el 11 vuelve `granted`.
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage !== 'granted') {
        this.toastService.showError('Sin permiso para guardar en el teléfono');
        return;
      }
      // `fileContent` ya es base64 sin prefijo, que es como el plugin espera un binario.
      // Si ya existe, se pisa: es el mismo documento descargado otra vez.
      await Filesystem.writeFile({
        path: fileName,
        data: this.fileContent,
        directory: Directory.Documents,
        recursive: true,
      });
      this.toastService.showSuccess(`Guardado en Documentos/${fileName}`);
    } catch (err) {
      console.error('[Documento] Error guardando el archivo:', err);
      this.toastService.showError('No pudimos guardar el documento');
    } finally {
      this.downloading = false;
    }
  }

  /**
   * Escribe el PDF en la caché de la app y se lo pasa al visor del sistema.
   * El nombre en disco es fijo por documento: así no importa qué caracteres
   * traiga el nombre original y abrirlo de nuevo pisa la copia anterior.
   */
  async openPdf() {
    if (this.opening || !this.fileContent) {
      return;
    }
    this.opening = true;
    try {
      const { uri } = await Filesystem.writeFile({
        path: `documento-${this.documentId}.pdf`,
        data: this.fileContent,
        directory: Directory.Cache,
      });
      await FileOpener.open({ filePath: uri, contentType: 'application/pdf' });
    } catch (err) {
      console.error('[Documento] Error abriendo el PDF:', err);
      this.toastService.showError('No encontramos una app para abrir el PDF');
    } finally {
      this.opening = false;
    }
  }

  private downloadInBrowser() {
    const link = document.createElement('a');
    if (this.isPdf && this.blobUrl) {
      link.href = this.blobUrl;
    } else {
      link.href = `data:${this.document.mimeType};base64,${this.fileContent}`;
    }
    link.download = this.document.fileName;
    link.click();
  }
}
