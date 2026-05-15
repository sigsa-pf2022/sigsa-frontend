import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { GroupsService } from '../shared/services/groups/groups.service';

@Component({
  selector: 'app-professional-requests',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="'/groups/home/' + groupId"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Solicitudes de profesionales</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="pr">
      <div *ngIf="isLoading" style="display: flex; justify-content: center; padding: 32px;">
        <ion-spinner></ion-spinner>
      </div>

      <ion-list *ngIf="!isLoading && requests.length > 0">
        <ion-card *ngFor="let req of requests" style="margin: 12px;">
          <ion-card-header>
            <ion-card-subtitle>Solicitud para</ion-card-subtitle>
            <ion-card-title>{{ req.dependentFirstName }} {{ req.dependentLastName }}</ion-card-title>
            <ion-card-subtitle>Grupo: {{ req.groupName }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Profesional:</strong> {{ req.professionalFirstName }} {{ req.professionalLastName }}</p>
            <p *ngIf="req.licenseNumber"><strong>Matrícula:</strong> {{ req.licenseNumber }}</p>
            <p *ngIf="req.specialization?.length > 0">
              <strong>Especialidad:</strong> {{ req.specialization[0]?.name }}
            </p>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <ion-button
                expand="block"
                color="success"
                style="flex: 1;"
                (click)="confirmAccept(req)"
                [disabled]="req.loading"
              >
                <ion-icon slot="start" name="checkmark-outline"></ion-icon>
                Aceptar
              </ion-button>
              <ion-button
                expand="block"
                color="danger"
                fill="outline"
                style="flex: 1;"
                (click)="confirmReject(req)"
                [disabled]="req.loading"
              >
                <ion-icon slot="start" name="close-outline"></ion-icon>
                Rechazar
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <div
        *ngIf="!isLoading && requests.length === 0"
        style="display: flex; flex-direction: column; align-items: center; padding: 48px 24px;"
      >
        <ion-icon name="shield-checkmark-outline" style="font-size: 64px; color: var(--ion-color-medium);"></ion-icon>
        <ion-label style="text-align: center; margin-top: 16px; color: var(--ion-color-medium);">
          No hay solicitudes pendientes.
        </ion-label>
      </div>
    </ion-content>
  `,
  styleUrls: ['./professional-requests.page.scss'],
})
export class ProfessionalRequestsPage implements OnInit {
  groupId: string;
  requests: any[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private groupsService: GroupsService,
    private modalController: ModalController,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  async ionViewWillEnter() {
    await this.loadRequests();
  }

  private async loadRequests() {
    this.isLoading = true;
    try {
      const all = await this.groupsService.getProfessionalRequests();
      // Filtra las solicitudes del grupo actual si se navegó desde un grupo específico
      this.requests = this.groupId
        ? (all || []).filter((r) => String(r.groupId) === String(this.groupId))
        : (all || []);
    } catch {
      this.toastService.showError('Error al cargar solicitudes');
      this.requests = [];
    } finally {
      this.isLoading = false;
    }
  }

  async confirmAccept(req: any) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: `¿Aceptar la solicitud de ${req.professionalFirstName} ${req.professionalLastName} para ${req.dependentFirstName} ${req.dependentLastName}?`,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      req.loading = true;
      try {
        await this.groupsService.acceptProfessionalRequest(req.id);
        this.toastService.showSuccess('Solicitud aceptada');
        await this.loadRequests();
      } catch (error) {
        const message = error?.error?.message || 'Error al aceptar la solicitud';
        this.toastService.showError(message);
        req.loading = false;
      }
    }
  }

  async confirmReject(req: any) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: `¿Rechazar la solicitud de ${req.professionalFirstName} ${req.professionalLastName}?`,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      req.loading = true;
      try {
        await this.groupsService.rejectProfessionalRequest(req.id);
        this.toastService.showSuccess('Solicitud rechazada');
        await this.loadRequests();
      } catch (error) {
        const message = error?.error?.message || 'Error al rechazar la solicitud';
        this.toastService.showError(message);
        req.loading = false;
      }
    }
  }
}
