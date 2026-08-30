import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MedsEventsService } from '../shared/services/meds-events/meds-events.service';
import { GroupEventsService } from 'src/app/views/groups/shared/services/group-events/group-events.service';
import { titleCase } from 'src/app/utils/title-case';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-view-med-event',
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
        <p class="listing-header__eyebrow">Recordatorio</p>
        <h1 class="listing-header__title">Medicamento</h1>
      </header>

      <app-loading-state *ngIf="loading" variant="spinner"></app-loading-state>

      <ng-container *ngIf="medEvent && !loading">
        <article class="vm__summary">
          <div class="vm__summary-icon" aria-hidden="true">
            <ion-icon name="medkit"></ion-icon>
          </div>
          <div class="vm__summary-body">
            <p class="vm__summary-name">{{ medEvent?.med?.name }}</p>
            <p class="vm__summary-meta">
              <span *ngIf="medEvent?.med?.dosage">{{ medEvent?.med?.dosage }}</span>
            </p>
          </div>
          <span
            *ngIf="medEvent?.status"
            class="status-badge"
            [ngClass]="statusBadgeClass"
          >
            {{ statusLabel }}
          </span>
        </article>

        <section class="vm__section">
          <div class="section-title vm__section-title">
            <h2>Detalles</h2>
          </div>
          <div class="vm__card">
            <div class="vm__row">
              <span class="vm__row-label">Fecha y hora</span>
              <span class="vm__row-value">{{ medEvent?.date | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="vm__row" *ngIf="medEvent?.totalDoses > 1">
              <span class="vm__row-label">Frecuencia</span>
              <span class="vm__row-value">Cada {{ medEvent?.intervalHours }} hs</span>
            </div>
            <div class="vm__row" *ngIf="medEvent?.totalDoses > 1">
              <span class="vm__row-label">Toma</span>
              <span class="vm__row-value">{{ medEvent?.doseIndex }} de {{ medEvent?.totalDoses }}</span>
            </div>
            <div class="vm__row" *ngIf="medEvent?.description">
              <span class="vm__row-label">Descripción</span>
              <span class="vm__row-value">{{ medEvent?.description }}</span>
            </div>
          </div>
        </section>

        <section class="vm__section" *ngIf="seriesDoses.length > 1">
          <div class="section-title vm__section-title">
            <h2>Tomas del tratamiento</h2>
          </div>
          <div class="vm__card">
            <div
              class="vm__row vm__dose"
              *ngFor="let dose of seriesDoses"
              [class.vm__dose--current]="dose.id === medEvent?.id"
            >
              <span class="vm__row-label">Toma {{ dose.doseIndex }}</span>
              <span class="vm__row-value">
                {{ dose.date | date: 'dd/MM HH:mm' }}
                <span class="status-badge" [ngClass]="doseBadgeClass(dose)">{{ doseLabel(dose) }}</span>
              </span>
            </div>
          </div>
        </section>

        <section class="vm__section" *ngIf="this.groupId">
          <div class="vm__takecharge" *ngIf="medEvent?.takenChargeByUserId; else takeChargeCta">
            <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
            <span>
              {{ takenChargeLabel }} se hizo cargo
              <small *ngIf="medEvent?.takenChargeAt">
                · {{ medEvent.takenChargeAt | date: 'dd/MM HH:mm' }}
              </small>
            </span>
          </div>
          <ng-template #takeChargeCta>
            <button
              type="button"
              class="auth-btn auth-btn--primary vm__takecharge-btn"
              (click)="takeCharge()"
              [disabled]="responding"
            >
              <ion-spinner *ngIf="responding" name="crescent"></ion-spinner>
              <ng-container *ngIf="!responding">Me hago cargo</ng-container>
            </button>
            <p class="auth-field__hint vm__takecharge-hint">
              Avisale al grupo que vos te ocupás de esta toma.
            </p>
          </ng-template>
        </section>
      </ng-container>
    </ion-content>
  `,
  styleUrls: ['./view-med-event.component.scss']
})
export class ViewMedEventComponent implements OnInit {
  medEventId: number;
  medEvent: any;
  groupId: string | null = null;
  /** Todas las tomas del tratamiento, cuando el evento pertenece a una serie. */
  seriesDoses: any[] = [];
  loading = false;
  notFound = false;
  responding = false;
  constructor(
    private route: ActivatedRoute,
    private medsEventsService: MedsEventsService,
    private groupEventsService: GroupEventsService,
    private toastService: ToastService,
    private navController: NavController
  ) {}

  get takenChargeLabel(): string {
    // Al cargar viene la relación `takenChargeBy`; al responder en el momento,
    // el nombre lo devuelve el propio endpoint.
    const by = this.medEvent?.takenChargeBy;
    const fromRelation = by ? `${by.firstName ?? ''} ${by.lastName ?? ''}`.trim() : '';
    return titleCase(fromRelation || this.medEvent?.takenChargeByName) || 'Alguien del grupo';
  }

  /** Un integrante avisa que él se ocupa de esta toma del dependiente. */
  async takeCharge() {
    if (this.responding || !this.medEvent) return;
    this.responding = true;
    try {
      const res = await this.groupEventsService.respondToEvent('med_event', this.medEvent.id, 'take_charge');
      this.medEvent = {
        ...this.medEvent,
        takenChargeByUserId: res.takenChargeByUserId,
        takenChargeByName: res.takenChargeByName,
        takenChargeAt: res.takenChargeAt,
      };
      this.toastService.showSuccess('Avisamos al grupo que te hacés cargo.');
    } catch ({ error }) {
      // 409: otro integrante ganó la carrera. El mensaje dice quién fue.
      this.toastService.showError(error?.message || 'No pudimos registrar la acción');
    } finally {
      this.responding = false;
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.medEventId = Number(this.route.snapshot.paramMap.get('id'));
    const dependentIdParam = this.route.snapshot.queryParamMap.get('dependentId');
    const dependentId = dependentIdParam ? Number(dependentIdParam) : null;
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    this.load(dependentId);
  }

  goBack() {
    // Si venimos del home de un grupo, volvemos ahí y no a la pestaña personal.
    const fallback = this.groupId ? `/groups/home/${this.groupId}` : '/tabs/meds';
    this.navController.navigateBack([fallback]);
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      confirmed: 'CONFIRMADO',
      created: 'CREADO',
      canceled: 'CANCELADO',
    };
    return map[this.medEvent?.status] || (this.medEvent?.status || '').toUpperCase();
  }

  get statusBadgeClass(): string {
    return this.badgeClassFor(this.medEvent?.status);
  }

  doseLabel(dose: any): string {
    const map: Record<string, string> = {
      confirmed: 'TOMADA',
      created: 'PENDIENTE',
      canceled: 'CANCELADA',
    };
    return map[dose?.status] || (dose?.status || '').toUpperCase();
  }

  doseBadgeClass(dose: any): string {
    return this.badgeClassFor(dose?.status);
  }

  private badgeClassFor(status: string): string {
    const map: Record<string, string> = {
      confirmed: 'status-badge--success',
      created: 'status-badge--violet',
      canceled: 'status-badge--danger',
    };
    return map[status] || '';
  }

  async load(dependentId?: number) {
    this.loading = true;
    this.notFound = false;
    await this.fallbackLoad(dependentId);
    this.notFound = !this.medEvent;
    this.loading = false;
    if (this.notFound) {
      // Navegar atrás solo si realmente no hay nada
      this.navController.navigateBack(['/meds']);
    }
  }

  private async fallbackLoad(dependentId?: number) {
    try {
      let list = [];
      if (dependentId) {
        list = await this.medsEventsService.getMedsEventsByDependent(dependentId);
      } else {
        list = await this.medsEventsService.getMedsEventsByUser();
      }
      this.medEvent = list?.find((m) => m.id === this.medEventId);
      // Si la toma pertenece a un tratamiento, las hermanas ya vienen en la
      // misma lista: no hace falta otra request.
      this.seriesDoses = this.medEvent?.seriesId
        ? (list || [])
            .filter((m) => m.seriesId === this.medEvent.seriesId)
            .sort((a, b) => a.doseIndex - b.doseIndex)
        : [];
    } catch {
      this.medEvent = null;
      this.seriesDoses = [];
    }
  }
}
