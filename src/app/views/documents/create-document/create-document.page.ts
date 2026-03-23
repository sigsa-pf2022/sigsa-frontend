import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, IonDatetime } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { formatISO } from 'date-fns';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { DocumentsService } from '../shared/services/documents.service';
import { CreateDocumentDTO } from '../shared/interfaces/Document.interface';

@Component({
  selector: 'app-create-document',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="dependentId ? '/groups/' + groupId : '/tabs/clipboard'"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">
          {{ isEditMode ? 'Editar' : 'Nuevo' }} Documento{{ dependentName ? ' de ' + dependentName : '' }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="cd">
      <form [formGroup]="form">
        <div class="cd__preview" *ngIf="documentPreview">
          <ion-label class="cd__preview__label">Vista previa</ion-label>
          <img *ngIf="documentPreview" [src]="documentPreview" class="cd__preview__image" />
          <ion-button (click)="removeDocument()" color="danger" size="small" fill="outline">
            <ion-icon slot="start" name="trash"></ion-icon>
            Remover
          </ion-button>
        </div>

        <div class="cd__select" *ngIf="!documentPreview && !isEditMode">
          <ion-button (click)="presentActionSheet()" expand="block" color="primary" fill="outline">
            <ion-icon slot="start" name="cloud-upload"></ion-icon>
            Seleccionar Documento
          </ion-button>
        </div>

        <div class="cd__form">
          <ion-input
            class="ui-form-input"
            placeholder="Título del documento *"
            formControlName="title"
          ></ion-input>

            <ion-textarea
              rows="4"
              class="ui-form-input"
              placeholder="Descripción (opcional)"
              formControlName="description"
            ></ion-textarea>

          <ion-input
            class="ui-form-input"
            placeholder="Fecha del documento *"
            formControlName="documentDate"
            id="open-modal-doc-date"
            readonly
          ></ion-input>
          <ion-modal trigger="open-modal-doc-date" class="calendar-modal-time">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #docDate
                  [value]="selectedDocumentDate"
                  [max]="maxDate"
                  locale="es-ES"
                  (ionChange)="documentDateChanged(docDate.value)"
                  [showDefaultButtons]="true"
                  presentation="date"
                >
                  <ion-buttons slot="buttons">
                    <ion-button color="primary" (click)="confirmDocumentDate()">Confirmar</ion-button>
                  </ion-buttons>
                </ion-datetime>
              </ion-content>
            </ng-template>
          </ion-modal>
        </div>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button
        (click)="onSubmit()"
        expand="block"
        [disabled]="!form.valid || (!fileContent && !isEditMode)"
        color="primary"
      >
        {{ isEditMode ? 'Actualizar' : 'Guardar' }}
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./create-document.page.scss'],
})
export class CreateDocumentPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;

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
        this.navController.navigateBack(['/groups/' + this.groupId]);
      } else {
        // Crear documento para usuario
        await this.documentsService.createDocument(payload);
        this.toastService.showSuccess('Documento creado correctamente');
        this.navController.navigateRoot(['/tabs/clipboard']);
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
      
      if (this.dependentId) {
        // Navegar de vuelta al grupo si estamos editando un documento de dependiente
        this.navController.navigateBack(['/groups/' + this.groupId]);
      } else {
        // Navegar a la lista de documentos si estamos editando un documento propio
        this.navController.navigateRoot(['/tabs/clipboard']);
      }
    } catch (error) {
      this.toastService.showError('Error al actualizar el documento');
    }
  }
}

