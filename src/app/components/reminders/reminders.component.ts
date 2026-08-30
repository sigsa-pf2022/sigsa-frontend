import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { REMINDERS_TYPE } from 'src/app/views/home/shared/constants/remindersType';

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

    <cdk-virtual-scroll-viewport *ngIf="!loading && activeTab === remindersTypes.medications" itemSize="3" class="rem__scroll">
      <app-meds-event-item-list
        *cdkVirtualFor="let medEvent of this.reminders"
        [medEvent]="medEvent"
        (click)="onItemClick(medEvent)"
      ></app-meds-event-item-list>
    </cdk-virtual-scroll-viewport>
    <cdk-virtual-scroll-viewport *ngIf="!loading && activeTab === remindersTypes.appointments" itemSize="3" class="rem__scroll">
      <app-appointments-item-list
        *cdkVirtualFor="let appointment of this.reminders"
        [appointment]="appointment"
        (click)="onItemClick(appointment)"
      ></app-appointments-item-list>
    </cdk-virtual-scroll-viewport>
    <cdk-virtual-scroll-viewport *ngIf="!loading && activeTab === remindersTypes.documents" itemSize="3" class="rem__scroll">
      <app-document-item-list
        *cdkVirtualFor="let document of this.reminders"
        [document]="document"
        (click)="onItemClick(document)"
      ></app-document-item-list>
    </cdk-virtual-scroll-viewport>
  `,
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements OnChanges {
  @Input() reminders: any[] = [];
  @Input() activeTab = REMINDERS_TYPE.medications;
  /** Mientras la página trae los datos mostramos el skeleton en vez de la lista vacía. */
  @Input() loading = false;
  @Output() tabChanged = new EventEmitter<string>();
  @Output() itemClicked = new EventEmitter<{ item: any; type: string }>();
  remindersTypes = REMINDERS_TYPE;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.reminders && 'currentValue' in changes.reminders) {
      this.reminders = changes.reminders.currentValue || [];
    }
    if (changes?.activeTab && 'currentValue' in changes.activeTab) {
      this.activeTab = changes.activeTab.currentValue || this.activeTab;
    }
  }

  changeReminders(event) {
    this.activeTab = event.detail.value;
    this.tabChanged.emit(event.detail.value);
  }

  onItemClick(item: any) {
    this.itemClicked.emit({ item, type: this.activeTab });
  }
}
