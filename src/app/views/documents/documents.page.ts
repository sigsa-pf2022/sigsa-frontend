import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DocumentsService } from './shared/services/documents.service';
import { MedicalDocument } from './shared/interfaces/Document.interface';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  template: `<ion-content class="docs">
    <ion-label class="view-title">Mis documentos</ion-label>
    <ng-container *ngIf="(documents$ | async) as documents">
      <ng-container *ngIf="documents.length > 0">
        <form [formGroup]="searchForm" class="docs__search">
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
          <app-document-item-list
            *ngFor="let document of (filteredDocuments$ | async)"
            [document]="document"
            [flush]="true"
            (click)="presentActionSheet(document)"
          ></app-document-item-list>
        </cdk-virtual-scroll-viewport>
      </ng-container>
    </ng-container>
    <div class="docs__empty" *ngIf="(documents$ | async)?.length === 0 && !(isLoading$ | async)">
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
    return this.navController.navigateRoot(['/documents/create']);
  }

  editDocument(id: number) {
    return this.navController.navigateRoot([`/documents/edit/${id}`]);
  }

  viewDocument(id: number) {
    return this.navController.navigateRoot([`/documents/view/${id}`]);
  }
}
