import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DocumentsService } from './shared/services/documents.service';
import { slideUpAnimation } from 'src/app/animations/slide-up.animation';
import { MedicalDocument } from './shared/interfaces/Document.interface';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  template: `
    <ion-content class="listing docs">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Tu historia clínica</p>
        <h1 class="listing-header__title">Mis documentos</h1>
      </header>

      <ng-container *ngIf="(documents$ | async) as documents">
        <ng-container *ngIf="documents.length > 0; else emptyState">
          <form [formGroup]="searchForm" class="listing-search">
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
              *cdkVirtualFor="let document of (filteredDocuments$ | async)"
              [document]="document"
              [flush]="true"
              (click)="presentActionSheet(document)"
            ></app-document-item-list>
          </cdk-virtual-scroll-viewport>
        </ng-container>

        <ng-template #emptyState>
          <div class="empty-state" role="status" *ngIf="!(isLoading$ | async)">
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
      </ng-container>

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
export class DocumentsPage implements OnInit {
  private documentsSubject$ = new BehaviorSubject<MedicalDocument[]>([]);
  private searchSubject$ = new BehaviorSubject<string>('');
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  documents$ = this.documentsSubject$.asObservable();
  isLoading$ = this.isLoadingSubject$.asObservable();

  filteredDocuments$: Observable<MedicalDocument[]> = combineLatest([
    this.documents$,
    this.searchSubject$
  ]).pipe(
    map(([documents, search]) => {
      if (!search) return documents;
      return documents.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase())
      );
    })
  );

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
    await this.loadDocuments();
  }

  private async loadDocuments() {
    this.isLoadingSubject$.next(true);
    try {
      const docs = await this.documentsService.getDocumentsByUser();
      this.documentsSubject$.next(docs || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      this.toastService.showError('Error al cargar documentos');
      this.documentsSubject$.next([]);
    } finally {
      this.isLoadingSubject$.next(false);
    }
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
    const search = event.detail.value;
    this.searchSubject$.next(search || '');
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
