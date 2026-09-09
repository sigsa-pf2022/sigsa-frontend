import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MedicalDocument } from 'src/app/views/documents/shared/interfaces/Document.interface';
import { PatientsService } from '../shared/services/patients.service';

@Component({
  selector: 'app-patient-documents',
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
        <p class="listing-header__eyebrow">Paciente</p>
        <h1 class="listing-header__title">{{ patientName | titlecase }}</h1>
      </header>

      <app-loading-state *ngIf="isLoading" [rows]="4"></app-loading-state>

      <div *ngIf="!isLoading && documents.length > 0" class="pd__scroll">
        <div class="section-title">
          <h2>Documentos</h2>
          <span>{{ documents.length }}</span>
        </div>

        <app-document-item-list
          *ngFor="let doc of documents"
          [document]="doc"
          [flush]="true"
          (click)="viewDocument(doc.id)"
        ></app-document-item-list>
      </div>

      <div *ngIf="!isLoading && documents.length === 0" class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">
          <ion-icon name="document-text"></ion-icon>
        </div>
        <h2 class="empty-state__title">Sin documentos</h2>
        <p class="empty-state__subtitle">
          Este paciente todavía no cargó estudios, recetas ni informes.
        </p>
      </div>
    </ion-content>
  `,
  styleUrls: ['./patient-documents.page.scss'],
})
export class PatientDocumentsPage implements OnInit {
  patientId: number;
  patientType: string;
  patientName = 'Documentos';
  documents: MedicalDocument[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private patientsService: PatientsService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.route.queryParams.subscribe((params) => {
      this.patientType = params['patientType'] || 'user';
      this.patientName = params['name'] || 'Documentos';
    });
    await this.loadDocuments();
  }

  goBack() {
    this.navController.navigateBack(['/patients']);
  }

  private async loadDocuments() {
    this.isLoading = true;
    try {
      this.documents =
        (await this.patientsService.getPatientDocuments(
          this.patientId,
          this.patientType,
        )) || [];
    } catch (error) {
      this.toastService.showError('Error al cargar documentos del paciente');
      this.documents = [];
    } finally {
      this.isLoading = false;
    }
  }

  viewDocument(id: number) {
    this.navController.navigateForward([`/documents/view/${id}`]);
  }
}
