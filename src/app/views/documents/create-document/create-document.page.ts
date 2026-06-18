import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, IonDatetime, IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { formatISO } from 'date-fns';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { DocumentsService } from '../shared/services/documents.service';
import { CreateDocumentDTO, EditDocumentDTO } from '../shared/interfaces/Document.interface';
import { slideUpAnimation } from 'src/app/animations/slide-up.animation';

@Component({
  selector: 'app-create-document',
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
      <header class="listing-header">
        <p class="listing-header__eyebrow">
          {{ isEditMode ? 'Editar documento' : 'Nuevo documento' }}
          <ng-container *ngIf="dependentName"> · para {{ dependentName | titlecase }}</ng-container>
        </p>
        <h1 class="listing-header__title">
          {{ isEditMode ? 'Editar datos' : 'Subí tu archivo' }}
        </h1>
      </header>

      <div class="cd__container">
        <div class="cd__upload">
          <div class="upload-preview" *ngIf="documentPreview">
            <img [src]="documentPreview" class="upload-preview__image" />
            <button type="button" class="upload-preview__remove" (click)="removeDocument()">
              <ion-icon name="trash-outline"></ion-icon>
              Remover archivo
            </button>
          </div>

          <button
            type="button"
            class="upload-card"
            *ngIf="!documentPreview"
            (click)="presentActionSheet()"
          >
            <div class="upload-card__icon" aria-hidden="true">
              <ion-icon name="cloud-upload-outline"></ion-icon>
            </div>
            <p class="upload-card__title">Seleccionar archivo</p>
            <p class="upload-card__subtitle">
              Tomá una foto o elegí una imagen de tu galería.
            </p>
          </button>
        </div>

        <form [formGroup]="form" class="auth-form cd__form">
          <div class="auth-field">
            <label class="auth-field__label" for="cd-title">Título</label>
            <div class="auth-input">
              <ion-input
                id="cd-title"
                placeholder="Ej: Análisis de sangre"
                formControlName="title"
                type="text"
              ></ion-input>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="cd-description">Descripción</label>
            <div class="auth-input cd__textarea">
              <ion-textarea
                id="cd-description"
                rows="4"
                placeholder="Notas u observaciones (opcional)"
                formControlName="description"
                autoGrow="true"
              ></ion-textarea>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="open-modal-doc-date">Fecha del documento</label>
            <button
              type="button"
              class="date-field"
              [class.date-field--empty]="!form.value.documentDate"
              (click)="openDateModal($event)"
            >
              <span>{{ form.value.documentDate || 'DD/MM/AAAA' }}</span>
              <ion-icon name="calendar-outline"></ion-icon>
            </button>
          </div>

          <ion-modal #docDateModal class="calendar-modal-time">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #docDate
                  [value]="selectedDocumentDate"
                  [max]="maxDate"
                  locale="es-ES"
                  (ionChange)="documentDateChanged(docDate.value)"
                  [showDefaultButtons]="false"
                  presentation="date"
                >
                  <ion-buttons slot="buttons">
                    <ion-button class="datetime-done" (click)="confirmDocumentDate()">Listo</ion-button>
                  </ion-buttons>
                </ion-datetime>
              </ion-content>
            </ng-template>
          </ion-modal>
        </form>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
        [disabled]="!form.valid || (!fileContent && !isEditMode)"
      >
        {{ isEditMode ? 'Actualizar' : 'Guardar' }}
      </button>
    </ion-footer>
  `,
  styleUrls: ['./create-document.page.scss'],
})
export class CreateDocumentPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('docDateModal') docDateModal: IonModal;

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    documentDate: [null, Validators.required],
  });

  fileContent: string = null; // Base64
  fileName: string = '';
  mimeType: string = '';
  fileSize: number = 0;
  documentPreview: string = null;
  selectedDocumentDate: string = formatISO(new Date(), { representation: 'date' });
  // Sólo fecha local (YYYY-MM-DD), igual que new-group/register. Evita el
  // corrimiento de .toISOString() (que en UTC-3 empujaba el max al día siguiente
  // y habilitaba mañana). El max queda exactamente en el día de hoy.
  maxDate = formatISO(new Date(), { representation: 'date' });
  isEditMode = false;
  documentId: number;
  dependentId: number;
  dependentName: string;
  groupId: number;

  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    private toastService: ToastService,
    private navController: NavController,
    private actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private dateFormatterService: DateFormatterService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.documentId = Number(this.route.snapshot.paramMap.get('id'));

    // Obtener queryParams para dependiente
    this.route.queryParams.subscribe(params => {
      this.dependentId = params['dependentId'] ? Number(params['dependentId']) : null;
      this.dependentName = params['dependentName'] || null;
      this.groupId = params['groupId'] ? Number(params['groupId']) : null;
    });

    if (this.documentId) {
      this.isEditMode = true;
      this.loadDocument();
    }
  }

  goBack() {
    const fallback = this.dependentId ? `/groups/home/${this.groupId}` : '/tabs/clipboard';
    this.navController.navigateBack([fallback], { animation: slideUpAnimation });
  }

  async loadDocument() {
    const document = await this.documentsService.getDocument(this.documentId);

    // Mostrar la imagen actual como preview (se puede reemplazar). NO seteamos
    // this.fileContent: queda en null hasta que el usuario elija una imagen
    // nueva, así sabemos si cambió y solo entonces la mandamos al backend.
    if (document.fileContent && document.mimeType) {
      this.mimeType = document.mimeType;
      this.fileName = document.fileName;
      this.documentPreview = `data:${document.mimeType};base64,${document.fileContent}`;
    }

    // documentDate llega como "YYYY-MM-DD" (columna date). Trabajamos sobre el
    // string para no arrastrar zona horaria (ver toDisplayDate).
    let formattedDate = '';
    if (document.documentDate) {
      this.selectedDocumentDate = String(document.documentDate).slice(0, 10);
      formattedDate = this.toDisplayDate(this.selectedDocumentDate);
    }

    this.form.patchValue({
      title: document.title,
      description: document.description,
      documentDate: formattedDate,
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar documento',
      mode: 'ios',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: 'Seleccionar de galería',
          icon: 'images',
          handler: () => {
            this.selectFromGallery();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 70, // Reducir calidad para optimizar tamaño
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1920, // Limitar ancho máximo
      });

      this.fileContent = image.base64String;
      this.mimeType = `image/${image.format}`;
      this.fileName = `document_${Date.now()}.${image.format}`;
      this.fileSize = this.calculateBase64Size(this.fileContent);
      this.documentPreview = `data:${this.mimeType};base64,${this.fileContent}`;

      // Advertir si el archivo es muy grande
      if (this.fileSize > 10 * 1024 * 1024) { // 10MB
        this.toastService.showError('La imagen es muy grande. Intenta con una de menor calidad.');
        this.removeDocument();
      }
    } catch (error) {
      this.toastService.showError('Error al capturar la imagen');
    }
  }

  async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 70, // Reducir calidad para optimizar tamaño
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
        width: 1920, // Limitar ancho máximo
      });

      this.fileContent = image.base64String;
      this.mimeType = `image/${image.format}`;
      this.fileName = `document_${Date.now()}.${image.format}`;
      this.fileSize = this.calculateBase64Size(this.fileContent);
      this.documentPreview = `data:${this.mimeType};base64,${this.fileContent}`;

      // Advertir si el archivo es muy grande
      if (this.fileSize > 10 * 1024 * 1024) { // 10MB
        this.toastService.showError('La imagen es muy grande. Intenta con una de menor calidad.');
        this.removeDocument();
      }
    } catch (error) {
      this.toastService.showError('Error al seleccionar la imagen');
    }
  }

  removeDocument() {
    this.fileContent = null;
    this.fileName = '';
    this.mimeType = '';
    this.fileSize = 0;
    this.documentPreview = null;
  }

  documentDateChanged(date: string | string[]) {
    const dateValue = Array.isArray(date) ? date[0] : date;
    if (!dateValue) {
      return;
    }
    // Guardamos sólo la parte de fecha (YYYY-MM-DD). No usamos new Date(): un
    // string sólo-fecha se interpreta como UTC y, en zonas negativas (UTC-3),
    // corre la fecha un día.
    this.selectedDocumentDate = dateValue.slice(0, 10);
    this.form.get('documentDate')?.setValue(this.toDisplayDate(this.selectedDocumentDate));
  }

  /**
   * Convierte "YYYY-MM-DD" (o "YYYY-MM-DDTHH:mm...") a "DD/MM/YYYY" operando
   * sobre el string, sin crear un Date, para evitar corrimientos de zona horaria.
   */
  private toDisplayDate(isoDate: string): string {
    const [year, month, day] = isoDate.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }

  confirmDocumentDate() {
    // (ionChange) no se dispara al tocar el día que ya viene preseleccionado
    // (hoy es el valor inicial), así que seleccionar hoy "de una" no llenaba el
    // input. Al confirmar leemos el valor actual del datetime para capturarlo
    // igual, sin depender de que haya habido un cambio.
    const current = this.datetime?.value;
    const value = Array.isArray(current) ? current[0] : current;
    if (value) {
      this.selectedDocumentDate = value.slice(0, 10);
      this.form.get('documentDate')?.setValue(this.toDisplayDate(this.selectedDocumentDate));
    }
    this.datetime.confirm(true);
  }

  async openDateModal(event: Event) {
    (event?.target as HTMLElement)?.blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    await this.docDateModal?.present();
  }

  calculateBase64Size(base64: string): number {
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length * 3) / 4 - padding;
  }

  async onSubmit() {
    if (this.isEditMode) {
      return this.editDocument();
    } else {
      return this.createDocument();
    }
  }

  async createDocument() {
    if (!this.fileContent) {
      this.toastService.showError('Debe seleccionar un documento');
      return;
    }

    if (!this.selectedDocumentDate) {
      this.toastService.showError('Debe seleccionar una fecha');
      return;
    }

    const payload: CreateDocumentDTO = {
      title: this.form.value.title,
      description: this.form.value.description || '',
      fileContent: this.fileContent,
      fileName: this.fileName,
      mimeType: this.mimeType,
      fileSize: this.fileSize,
      // Hora local 00:00 (sin Z) para que el backend guarde el día correcto
      // sin importar la zona horaria del servidor.
      documentDate: `${this.selectedDocumentDate}T00:00:00`,
      date: formatISO(new Date()),
    };

    try {
      if (this.dependentId) {
        // Crear documento para dependiente
        await this.documentsService.createDocumentForDependent(this.dependentId, payload);
        this.toastService.showSuccess(`Documento creado correctamente para ${this.dependentName}`);
        this.navController.navigateRoot(['/groups/home/' + this.groupId]);
      } else {
        // Crear documento para usuario
        await this.documentsService.createDocument(payload);
        this.toastService.showSuccess('Documento creado correctamente');
        // Notificar para que el listado de documentos se refresque al volver.
        this.documentsService.notifyDocumentsChanged();
        this.navController.navigateForward(['/tabs/clipboard']);
      }
    } catch (error) {
      this.toastService.showError('Error al crear el documento');
    }
  }

  async editDocument() {
    const payload: EditDocumentDTO = {
      title: this.form.value.title,
      description: this.form.value.description,
      documentDate: this.selectedDocumentDate
        ? `${this.selectedDocumentDate}T00:00:00`
        : this.form.value.documentDate,
    };

    // Si el usuario eligió una imagen nueva, la enviamos para reemplazar la actual.
    if (this.fileContent) {
      payload.fileContent = this.fileContent;
      payload.fileName = this.fileName;
      payload.mimeType = this.mimeType;
      payload.fileSize = this.fileSize;
    }

    try {
      await this.documentsService.editDocument(this.documentId, payload);
      this.toastService.showSuccess('Documento actualizado correctamente');
      this.documentsService.notifyDocumentsChanged();

      if (this.dependentId) {
        // Navegar de vuelta al grupo si estamos editando un documento de dependiente
        this.navController.navigateRoot(['/groups/home/' + this.groupId]);
      } else {
        // Navegar a la lista de documentos si estamos editando un documento propio
        this.navController.navigateForward(['/tabs/clipboard']);
      }
    } catch (error) {
      this.toastService.showError('Error al actualizar el documento');
    }
  }
}
