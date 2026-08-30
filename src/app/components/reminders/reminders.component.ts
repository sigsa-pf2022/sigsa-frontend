import { Component, EventEmitter, Input, Output } from '@angular/core';
import { REMINDERS_TYPE } from 'src/app/views/home/shared/constants/remindersType';

const EMPTY_COPY = {
  [REMINDERS_TYPE.medications]: {
    title: 'Sin recordatorios de medicación',
    subtitle: 'Cuando agregues un medicamento, va a aparecer acá.',
    icon: 'medkit-outline',
  },
  [REMINDERS_TYPE.appointments]: {
    title: 'Sin turnos',
    subtitle: 'Cuando agregues un turno, va a aparecer acá.',
    icon: 'calendar-outline',
  },
  [REMINDERS_TYPE.documents]: {
    title: 'Sin documentos',
    subtitle: 'Cuando subas un documento, va a aparecer acá.',
    icon: 'document-text-outline',
  },
};

@Component({
  selector: 'app-reminders',
  template: `
    <div class="rem">
      <div class="rem__section-title">
        <h2>Tus recordatorios</h2>
      </div>

      <ion-segment
        class="rem__segment"
        (ionChange)="changeReminders($event)"
        [value]="activeTab"
        mode="md"
      >
        <ion-segment-button class="rem__segment__button" [value]="remindersTypes.medications">
          <ion-label>Medicamentos</ion-label>
        </ion-segment-button>
        <ion-segment-button class="rem__segment__button" [value]="remindersTypes.appointments">
          <ion-label>Turnos</ion-label>
        </ion-segment-button>
        <ion-segment-button class="rem__segment__button" [value]="remindersTypes.documents">
          <ion-label>Documentos</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>

    <app-loading-state *ngIf="loading" [rows]="4"></app-loading-state>

    <!-- Sin la lista vacía explícita, un listado sin items se veía como un hueco
         en blanco y parecía que el cambio de pestaña no había hecho nada. -->
    <app-empty-event-card
      *ngIf="!loading && !reminders.length"
      class="rem__empty"
      [title]="emptyCopy.title"
      [subtitle]="emptyCopy.subtitle"
      [icon]="emptyCopy.icon"
    ></app-empty-event-card>

    <!-- Modo compacto (home del grupo): pocas filas y la página scrollea sola. -->
    <div class="rem__list" *ngIf="!loading && maxItems > 0 && reminders.length">
      <ng-container *ngFor="let item of visibleReminders">
        <app-meds-event-item-list
          *ngIf="activeTab === remindersTypes.medications"
          [medEvent]="item"
          (click)="onItemClick(item)"
        ></app-meds-event-item-list>
        <app-appointments-item-list
          *ngIf="activeTab === remindersTypes.appointments"
          [appointment]="item"
          (click)="onItemClick(item)"
        ></app-appointments-item-list>
        <app-document-item-list
          *ngIf="activeTab === remindersTypes.documents"
          [document]="item"
          (click)="onItemClick(item)"
        ></app-document-item-list>
      </ng-container>

      <button
        type="button"
        class="rem__view-all"
        *ngIf="hiddenCount > 0"
        (click)="viewAllClicked.emit(activeTab)"
      >
        <span class="rem__view-all__label">Ver todos</span>
        <span class="rem__view-all__count">{{ reminders.length }}</span>
        <ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
      </button>
    </div>

    <!-- Modo completo (home personal): scroll virtual propio. -->
    <ng-container *ngIf="!loading && !maxItems && reminders.length">
      <cdk-virtual-scroll-viewport *ngIf="activeTab === remindersTypes.medications" itemSize="80" class="rem__scroll">
        <app-meds-event-item-list
          *cdkVirtualFor="let medEvent of this.reminders"
          [medEvent]="medEvent"
          (click)="onItemClick(medEvent)"
        ></app-meds-event-item-list>
      </cdk-virtual-scroll-viewport>
      <cdk-virtual-scroll-viewport *ngIf="activeTab === remindersTypes.appointments" itemSize="80" class="rem__scroll">
        <app-appointments-item-list
          *cdkVirtualFor="let appointment of this.reminders"
          [appointment]="appointment"
          (click)="onItemClick(appointment)"
        ></app-appointments-item-list>
      </cdk-virtual-scroll-viewport>
      <cdk-virtual-scroll-viewport *ngIf="activeTab === remindersTypes.documents" itemSize="80" class="rem__scroll">
        <app-document-item-list
          *cdkVirtualFor="let document of this.reminders"
          [document]="document"
          (click)="onItemClick(document)"
        ></app-document-item-list>
      </cdk-virtual-scroll-viewport>
    </ng-container>
  `,
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent {
  @Input() reminders: any[] = [];
  @Input() activeTab = REMINDERS_TYPE.medications;
  /** Mientras la página trae los datos mostramos el skeleton en vez de la lista vacía. */
  @Input() loading = false;
  /**
   * Tope de filas a mostrar. En 0 (default) se muestra todo con scroll virtual;
   * con un tope, la lista queda corta y aparece "Ver todos".
   */
  @Input() maxItems = 0;
  @Output() tabChanged = new EventEmitter<string>();
  @Output() itemClicked = new EventEmitter<{ item: any; type: string }>();
  @Output() viewAllClicked = new EventEmitter<string>();
  remindersTypes = REMINDERS_TYPE;

  get visibleReminders(): any[] {
    return this.maxItems > 0 ? (this.reminders || []).slice(0, this.maxItems) : this.reminders || [];
  }

  get hiddenCount(): number {
    return Math.max(0, (this.reminders?.length || 0) - this.visibleReminders.length);
  }

  get emptyCopy() {
    return EMPTY_COPY[this.activeTab] || EMPTY_COPY[this.remindersTypes.appointments];
  }

  changeReminders(event) {
    this.activeTab = event.detail.value;
    this.tabChanged.emit(event.detail.value);
  }

  onItemClick(item: any) {
    this.itemClicked.emit({ item, type: this.activeTab });
  }
}
