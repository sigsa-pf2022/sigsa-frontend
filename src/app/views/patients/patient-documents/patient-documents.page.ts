import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MedicalDocument } from 'src/app/views/documents/shared/interfaces/Document.interface';
import { PatientsService } from '../shared/services/patients.service';

@Component({
  selector: 'app-patient-documents',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/patients"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">{{ patientName }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="pd">
      <ion-label class="view-title" style="padding: 16px;">Documentos del paciente</ion-label>
      <ion-list *ngIf="documents.length > 0">
        <app-document-item-list
          *ngFor="let doc of documents"
          [document]="doc"
          [flush]="true"
          (click)="viewDocument(doc.id)"
        ></app-document-item-list>
      </ion-list>
      <div class="pd__empty" *ngIf="documents.length === 0 && !isLoading">
        <ion-icon name="document-text-outline" style="font-size: 64px; color: var(--ion-color-medium);"></ion-icon>
        <ion-label style="text-align: center; margin-top: 16px; color: var(--ion-color-medium);">
          Este paciente no tiene documentos cargados.
        </ion-label>
      </div>
      <ion-spinner *ngIf="isLoading" name="crescent" style="display: block; margin: 32px auto;"></ion-spinner>
    </ion-content>
  `,
  styleUrls: ['./patient-documents.page.scss'],
})
export class PatientDocumentsPage implements OnInit {
  patientId: number;
  patientType: string;
  patientName = 'Documentos';
  documents: MedicalDocument[] = [];
  isLoading = false;

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
