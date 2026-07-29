import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { GroupEventsService } from '../shared/services/group-events/group-events.service';
import { titleCase } from 'src/app/utils/title-case';

/** Texto e ícono de cada acción del historial. */
const ACTION_LABELS: Record<string, { icon: string; text: (p: any) => string }> = {
  event_created: {
    icon: 'add-circle-outline',
    text: (p) => `Creó ${p?.medName ? `el medicamento ${p.medName}` : 'un turno'}`,
  },
  event_taken_charge: {
    icon: 'hand-left-outline',
    text: (p) => `Se hizo cargo de ${p?.medName ? p.medName : 'un turno'}`,
  },
  event_confirmed: { icon: 'checkmark-circle-outline', text: () => 'Confirmó un evento' },
  event_canceled: { icon: 'close-circle-outline', text: () => 'Canceló un evento' },
  member_added: {
    icon: 'person-add-outline',
    text: (p) => `Agregó a ${titleCase(p?.memberName) || 'un integrante'}`,
  },
  member_removed: {
    icon: 'person-remove-outline',
    text: (p) =>
      p?.selfRemoved ? 'Salió del grupo' : `Sacó a ${titleCase(p?.memberName) || 'un integrante'}`,
  },
  professional_linked: {
    icon: 'medkit-outline',
    text: (p) => `Vinculó a ${titleCase(p?.professionalName) || 'un profesional'}`,
  },
};

@Component({
  selector: 'app-group-history',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button type="button" class="auth-back" (click)="goToGroupHome()" aria-label="Volver">
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Grupo familiar</p>
        <h1 class="listing-header__title">Historial</h1>
      </header>

      <div class="gh-history__scroll" *ngIf="entries.length; else emptyState">
        <ion-item *ngFor="let entry of entries" class="member-row" lines="none">
          <div class="member-row__avatar">
            <app-avatar [name]="entry.actorName" icon="ellipse-outline"></app-avatar>
          </div>
          <div class="member-row__body">
            <span class="member-row__name">{{ describe(entry) }}</span>
            <span class="member-row__sub">
              {{ (entry.actorName | titlecase) || 'Alguien' }} · {{ entry.createdAt | date: 'dd/MM/yyyy HH:mm' }}
            </span>
          </div>
          <span class="gh-history__icon" aria-hidden="true">
            <ion-icon [name]="iconFor(entry)"></ion-icon>
          </span>
        </ion-item>
      </div>

      <ng-template #emptyState>
        <div class="empty-state" role="status" *ngIf="!loading">
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="time-outline"></ion-icon>
          </div>
          <h2 class="empty-state__title">Todavía no hay actividad</h2>
          <p class="empty-state__subtitle">
            Acá vas a ver quién creó cada evento y quién se hizo cargo.
          </p>
        </div>
      </ng-template>
    </ion-content>
  `,
  styleUrls: ['./group-history.page.scss'],
})
export class GroupHistoryPage implements OnInit {
  groupId: string;
  entries: any[] = [];
  loading = false;

  constructor(
    private groupEventsService: GroupEventsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  ionViewWillEnter() {
    this.getHistory();
  }

  goToGroupHome() {
    return this.navController.navigateBack([`/groups/home/${this.groupId}`]);
  }

  async getHistory() {
    this.loading = true;
    await this.showLoading();
    try {
      const res = await this.groupEventsService.getHistory(this.groupId);
      this.entries = res?.entries ?? [];
    } catch {
      this.entries = [];
    } finally {
      this.loading = false;
      this.closeLoading();
    }
  }

  describe(entry: any): string {
    return ACTION_LABELS[entry?.action]?.text(entry?.payload) ?? 'Actividad del grupo';
  }

  iconFor(entry: any): string {
    return ACTION_LABELS[entry?.action]?.icon ?? 'ellipse-outline';
  }

  getInitials(entry: any): string {
    const name = (entry?.actorName ?? '').trim();
    if (!name) return '?';
    const [first = '', last = ''] = name.split(' ');
    return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 2000,
    });
    await loading.present();
  }

  async closeLoading() {
    const loading = await this.loadingController.getTop();
    if (loading) {
      await loading.dismiss();
    }
  }
}
