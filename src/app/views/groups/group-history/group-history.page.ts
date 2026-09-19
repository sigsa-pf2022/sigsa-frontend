import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GroupEventsService } from '../shared/services/group-events/group-events.service';
import { titleCase } from 'src/app/utils/title-case';

/**
 * Texto e ícono de cada acción del historial.
 *
 * Adentro de un grupo la fila ya dice de qué evento se trata, así que el texto
 * de cada movimiento se queda con el verbo y no repite el nombre.
 */
const ACTION_LABELS: Record<string, { icon: string; text: (p: any) => string }> = {
  event_created: { icon: 'add-circle-outline', text: () => 'Lo creó' },
  event_taken_charge: { icon: 'hand-left-outline', text: () => 'Se hizo cargo' },
  event_declined: { icon: 'remove-circle-outline', text: () => 'Avisó que no puede' },
  event_deleted: { icon: 'trash-outline', text: () => 'Lo borró' },
  event_confirmed: { icon: 'checkmark-circle-outline', text: () => 'Lo confirmó' },
  event_canceled: {
    icon: 'close-circle-outline',
    // Antes el cron cancelaba los turnos vencidos y por eso se distinguía; ese
    // cron se apagó, pero quedan entradas viejas con la marca.
    text: (p) => (p?.automatic ? 'Venció' : 'Lo canceló'),
  },
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

      <app-loading-state *ngIf="loading" [rows]="5"></app-loading-state>

      <div
        class="gh-history__scroll"
        *ngIf="!loading && groups.length; else emptyState"
      >
        <ng-container *ngFor="let group of groups">
          <!--
            Un evento con sus movimientos adentro. Las entradas que no son de un
            evento (alguien se sumó al grupo) llegan con grouped=false y se
            dibujan como fila simple, sin desplegable.
          -->
          <ion-item
            class="member-row"
            lines="none"
            [button]="group.grouped"
            detail="false"
            (click)="group.grouped && toggle(group.groupKey)"
          >
            <div class="member-row__avatar">
              <app-avatar
                [photo]="group.lastEntry.actorPhoto"
                [name]="group.lastEntry.actorName"
                icon="ellipse-outline"
              ></app-avatar>
            </div>
            <div class="member-row__body">
              <span class="member-row__name">{{ titleFor(group) }}</span>
              <span class="member-row__sub">
                {{ actorFor(group.lastEntry) }} {{ describe(group.lastEntry) | lowercase }} ·
                {{ group.lastEntry.createdAt | date: 'dd/MM HH:mm' }}
              </span>
            </div>
            <span
              class="gh-history__icon"
              [class.gh-history__icon--open]="isOpen(group.groupKey)"
              aria-hidden="true"
            >
              <ion-icon
                [name]="group.grouped ? 'chevron-down' : iconFor(group.lastEntry)"
              ></ion-icon>
            </span>
          </ion-item>

          <div class="gh-history__detail" *ngIf="group.grouped && isOpen(group.groupKey)">
            <div class="gh-history__step" *ngFor="let entry of group.entries">
              <span class="gh-history__step-icon" aria-hidden="true">
                <ion-icon [name]="iconFor(entry)"></ion-icon>
              </span>
              <div class="gh-history__step-body">
                <span class="gh-history__step-text">
                  {{ actorFor(entry) }} · {{ describe(entry) | lowercase }}
                </span>
                <span class="gh-history__step-date">
                  {{ entry.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                </span>
              </div>
            </div>
          </div>
        </ng-container>
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
  groups: any[] = [];
  loading = false;
  /** Qué grupo está desplegado. Uno por vez: el historial se lee de a uno. */
  expandedKey: string | null = null;

  constructor(
    private groupEventsService: GroupEventsService,
    private navController: NavController,
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
    // Antes usábamos un LoadingController con duration: 2000, que se
    // auto-cerraba a los 2s aunque la request siguiera en vuelo. Ahora el
    // skeleton vive y muere con la request.
    this.loading = this.groups.length === 0;
    try {
      const res = await this.groupEventsService.getHistory(this.groupId);
      this.groups = res?.groups ?? [];
    } catch {
      this.groups = [];
    } finally {
      this.loading = false;
    }
  }

  toggle(groupKey: string) {
    this.expandedKey = this.expandedKey === groupKey ? null : groupKey;
  }

  isOpen(groupKey: string): boolean {
    return this.expandedKey === groupKey;
  }

  /**
   * Título de la fila cerrada: de qué evento se trata.
   *
   * El payload trae el nombre del medicamento o el del profesional según el
   * tipo, más la fecha del evento. En un tratamiento se usa el de la entrada de
   * creación, porque las otras guardan la fecha de otra toma.
   */
  titleFor(group: any): string {
    const p = group?.title ?? {};
    if (group?.targetType === 'member') {
      return this.describe(group.lastEntry);
    }
    const nombre = p.medName
      ? p.medName
      : p.professionalName
      ? `Turno con ${titleCase(p.professionalName)}`
      : group?.targetType === 'med_event'
      ? 'Medicamento'
      : 'Turno';
    const dep = p.dependentName ? ` · ${titleCase(p.dependentName)}` : '';
    return `${nombre}${dep}`;
  }

  describe(entry: any): string {
    return ACTION_LABELS[entry?.action]?.text(entry?.payload) ?? 'Actividad del grupo';
  }

  iconFor(entry: any): string {
    return ACTION_LABELS[entry?.action]?.icon ?? 'ellipse-outline';
  }

  /**
   * Quién figura como autor. Las entradas sin actor son del cron que vence los
   * turnos: decir "Alguien" ahí hace pensar que fue un integrante del grupo.
   */
  actorFor(entry: any): string {
    const name = titleCase(entry?.actorName);
    if (name) return name;
    return entry?.payload?.automatic ? 'El sistema' : 'Alguien';
  }



}
