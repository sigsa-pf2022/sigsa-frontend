import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DocumentsService } from './shared/services/documents.service';
import { MedicalDocument } from './shared/interfaces/Document.interface';

@Component({
  selector: 'app-documents',
  template: `<ion-content class="docs">
    <ion-label class="view-title">Mis documentos</ion-label>
    <ng-container *ngIf="this.documents.length > 0">
      <form [formGroup]="this.searchForm" class="docs__search">
        <ion-searchbar
          formControlName="search"
          placeholder="Buscar documento ..."
          class="ui-search-input ui-search-input__no-show"
          debounce="400"
          type="string"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>
      <cdk-virtual-scroll-viewport itemSize="1">
        <ion-item
          *ngFor="let document of this.filteredDocuments"
          lines="full"
          class="docs__item"
          (click)="presentActionSheet(document)"
        >
          <div class="docs__item__wrapper">
            <ion-icon
              [name]="getIconByMimeType(document.mimeType)"
              class="docs__item__icon"
            ></ion-icon>
            <div class="docs__item__content">
              <ion-label class="docs__item__title">{{ document.title }}</ion-label>
              <ion-text class="docs__item__date">{{ document.documentDate | date: 'dd/MM/yyyy' }}</ion-text>
              <ion-text class="docs__item__size" *ngIf="document.fileSize">{{ formatFileSize(document.fileSize) }}</ion-text>
            </div>
          </div>
        </ion-item>
      </cdk-virtual-scroll-viewport>
    </ng-container>
    <div class="docs__empty" *ngIf="this.documents.length === 0">
      <img src="/assets/images/documents/documents-empty.svg" />
      <ion-label class="docs__empty__title"
        >Todavía no tienes ningún documento<br />
        ¿Qué esperas para agregar tu primer documento médico?</ion-label
      >
    </div>
    <div>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="newDocument()" class="docs__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </div>
  </ion-content>`,
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  documents: MedicalDocument[] = [];
  filteredDocuments: MedicalDocument[] = [];
  searchForm = this.fb.group({
    search: '',
  });

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private documentsService: DocumentsService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.setDocuments();
  }

  async setDocuments() {
    this.documents = [...(await this.documentsService.getDocumentsByUser())];
    this.filteredDocuments = this.documents;
  }

  async presentActionSheet(document: MedicalDocument) {
    const actionSheet = await this.actionSheetService.createDefault('Mi Documento');
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doActionByRole(role, document.id);
  }

  doActionByRole(value: string, id: number) {
    switch (value) {
      case 'destructive':
        this.deleteDocument(id);
        break;
      case 'edit':
        this.editDocument(id);
        break;
      case 'view':
        this.viewDocument(id);
        break;
      default:
        break;
    }
  }

  async deleteDocument(id: number) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea eliminar el documento?',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.documentsService
        .deleteDocument(id)
        .then(() => this.toastService.showSuccess('Documento eliminado correctamente.'))
        .then(() => this.setDocuments())
        .catch(() => {});
    }
  }

  async handleChange(event) {
    const search = event.detail.value.toLowerCase();
    this.filteredDocuments = this.documents.filter((doc) =>
      doc.title.toLowerCase().includes(search)
    );
  }

  newDocument() {
    return this.navController.navigateRoot(['/documents/create']);
  }

  editDocument(id: number) {
    return this.navController.navigateRoot([`/documents/edit/${id}`]);
  }

  viewDocument(id: number) {
    return this.navController.navigateRoot([`/documents/view/${id}`]);
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
}
