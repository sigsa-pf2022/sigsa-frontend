import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, IonDatetime, IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { formatISO } from 'date-fns';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { DocumentsService } from '../shared/services/documents.service';
import { CreateDocumentDTO } from '../shared/interfaces/Document.interface';
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
        <div class="cd__upload" *ngIf="!isEditMode">
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
  maxDate = formatISO(new Date());
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

    // Formatear la fecha para mostrar
    let formattedDate = '';
    if (document.documentDate) {
      try {
        const dateObj = new Date(document.documentDate);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        formattedDate = `${day}/${month}/${year}`;

        // Guardar el valor ISO para edición
        this.selectedDocumentDate = formatISO(dateObj, { representation: 'date' });
      } catch (error) {
        console.error('Error formatting date:', error);
        formattedDate = document.documentDate.toString();
      }
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
    this.selectedDocumentDate = dateValue;

    // Formatear la fecha para mostrar en el input (formato simple español)
    try {
      const dateObj = new Date(dateValue);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      this.form.get('documentDate')?.setValue(formattedDate);
    } catch (error) {
      console.error('Error formatting date:', error);
      this.form.get('documentDate')?.setValue(dateValue);
    }
  }

  confirmDocumentDate() {
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
      documentDate: this.selectedDocumentDate,
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
    const payload = {
      title: this.form.value.title,
      description: this.form.value.description,
      documentDate: this.selectedDocumentDate || this.form.value.documentDate,
    };

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
