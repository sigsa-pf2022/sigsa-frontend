import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DocumentsService } from './shared/services/documents.service';
import { slideUpAnimation } from 'src/app/animations/slide-up.animation';
import { MedicalDocument } from './shared/interfaces/Document.interface';

@Component({
  selector: 'app-documents',
  template: `
    <ion-content class="listing docs">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Tu historia clínica</p>
        <h1 class="listing-header__title">Mis documentos</h1>
      </header>

      <ng-container *ngIf="this.documents.length > 0; else emptyState">
        <form [formGroup]="this.searchForm" class="listing-search">
          <ion-searchbar
            class="listing-searchbar"
            formControlName="search"
            placeholder="Buscar documento..."
            debounce="400"
            type="string"
            mode="md"
            (ionChange)="handleChange($event)"
          ></ion-searchbar>
        </form>

        <cdk-virtual-scroll-viewport itemSize="80" class="listing-scroll">
          <app-document-item-list
            *cdkVirtualFor="let document of this.filteredDocuments"
            [document]="document"
            [flush]="true"
            (click)="presentActionSheet(document)"
          ></app-document-item-list>
        </cdk-virtual-scroll-viewport>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state" role="status" *ngIf="!this.isLoading">
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="document-text"></ion-icon>
          </div>
          <h2 class="empty-state__title">Sin documentos todavía</h2>
          <p class="empty-state__subtitle">
            Subí estudios, recetas o informes y los tenés siempre a mano.
          </p>
          <button type="button" class="empty-state__cta" (click)="newDocument()">
            <ion-icon name="add"></ion-icon>
            Agregar documento
          </button>
        </div>
      </ng-template>

      <ion-fab class="app-fab" vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button
          class="app-fab-button"
          (click)="newDocument()"
          aria-label="Agregar documento"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit, OnDestroy {
  documents: MedicalDocument[] = [];
  filteredDocuments: MedicalDocument[] = [];
  isLoading = false;
  searchForm = this.fb.group({
    search: '',
  });
  private documentsSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private documentsService: DocumentsService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // El flujo de creación vive en una ruta fuera de los tabs, por lo que al
    // volver a /tabs/clipboard la página cacheada no siempre dispara
    // ionViewWillEnter. Nos suscribimos a los cambios para refrescar el listado.
    this.documentsSub = this.documentsService.documentsChanged$.subscribe(() =>
      this.loadDocuments()
    );
  }

  ngOnDestroy() {
    this.documentsSub?.unsubscribe();
  }

  async ionViewWillEnter() {
    await this.loadDocuments();
  }

  async loadDocuments() {
    this.isLoading = true;
    try {
      const docs = await this.documentsService.getDocumentsByUser();
      this.documents = [...(docs || [])];
      this.applyFilter(this.searchForm.value.search || '');
    } catch (error) {
      console.error('Error loading documents:', error);
      this.toastService.showError('Error al cargar documentos');
      this.documents = [];
      this.filteredDocuments = [];
    } finally {
      this.isLoading = false;
    }
  }

  private applyFilter(search: string) {
    const term = search.toLowerCase();
    this.filteredDocuments = this.documents.filter((d) =>
      (d?.title ?? '').toLowerCase().includes(term)
    );
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
        .then(() => this.loadDocuments())
        .catch(() => {});
    }
  }

  handleChange(event) {
    this.applyFilter(event.detail.value || '');
  }

  newDocument() {
    return this.navController.navigateForward(['/documents/create'], { animation: slideUpAnimation });
  }

  editDocument(id: number) {
    return this.navController.navigateRoot([`/documents/edit/${id}`]);
  }

  viewDocument(id: number) {
    return this.navController.navigateRoot([`/documents/view/${id}`]);
  }
}
