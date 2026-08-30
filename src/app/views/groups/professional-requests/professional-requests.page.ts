import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { GroupsService } from '../shared/services/groups/groups.service';

@Component({
  selector: 'app-professional-requests',
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
        <p class="listing-header__eyebrow">Grupo familiar</p>
        <h1 class="listing-header__title">Solicitudes</h1>
      </header>

      <app-loading-state *ngIf="isLoading" [rows]="3"></app-loading-state>

      <div *ngIf="!isLoading && requests.length > 0" class="pr__list">
        <article *ngFor="let req of requests" class="pr__card">
          <header class="pr__card-head">
            <div class="pr__card-icon" aria-hidden="true">
              <ion-icon name="shield-checkmark"></ion-icon>
            </div>
            <div class="pr__card-titles">
              <p class="pr__card-eyebrow">Solicitud para</p>
              <p class="pr__card-title">{{ req.dependentFirstName }} {{ req.dependentLastName }}</p>
              <p class="pr__card-sub">Grupo: {{ req.groupName }}</p>
            </div>
          </header>

          <div class="pr__card-body">
            <div class="pr__row">
              <span class="pr__row-label">Profesional</span>
              <span class="pr__row-value">{{ req.professionalFirstName }} {{ req.professionalLastName }}</span>
            </div>
            <div class="pr__row" *ngIf="req.licenseNumber">
              <span class="pr__row-label">Matrícula</span>
              <span class="pr__row-value">{{ req.licenseNumber }}</span>
            </div>
            <div class="pr__row" *ngIf="req.specialization?.length > 0">
              <span class="pr__row-label">Especialidad</span>
              <span class="pr__row-value">{{ req.specialization[0]?.name }}</span>
            </div>
          </div>

          <div class="pr__card-actions">
            <button
              type="button"
              class="auth-btn auth-btn--primary pr__btn-accept"
              (click)="confirmAccept(req)"
              [disabled]="req.loading"
            >
              <ion-icon name="checkmark"></ion-icon>
              Aceptar
            </button>
            <button
              type="button"
              class="auth-btn auth-btn--secondary pr__btn-reject"
              (click)="confirmReject(req)"
              [disabled]="req.loading"
            >
              <ion-icon name="close"></ion-icon>
              Rechazar
            </button>
          </div>
        </article>
      </div>

      <div *ngIf="!isLoading && requests.length === 0" class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">
          <ion-icon name="shield-checkmark"></ion-icon>
        </div>
        <h2 class="empty-state__title">Sin solicitudes pendientes</h2>
        <p class="empty-state__subtitle">
          Te avisamos por acá cuando un profesional pida acceso al grupo.
        </p>
      </div>
    </ion-content>
  `,
  styleUrls: ['./professional-requests.page.scss'],
})
export class ProfessionalRequestsPage implements OnInit {
  groupId: string;
  requests: any[] = [];
  isLoading = true;

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

  goBack() {
    if (this.groupId) {
      this.navController.navigateBack([`/groups/home/${this.groupId}`]);
    } else {
      this.navController.navigateBack(['/tabs/groups']);
    }
  }

  private async loadRequests() {
    // Solo mostramos el skeleton si no hay nada en pantalla: al volver a la
    // vista refrescamos en silencio sobre los datos que ya se ven.
    this.isLoading = this.requests.length === 0;
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
