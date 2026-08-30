import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { REMINDERS_TYPE } from 'src/app/views/home/shared/constants/remindersType';

const TITLES = {
  [REMINDERS_TYPE.medications]: 'Medicación',
  [REMINDERS_TYPE.appointments]: 'Turnos',
  [REMINDERS_TYPE.documents]: 'Documentos',
};

/**
 * Lista completa de recordatorios del dependiente. El home del grupo muestra
 * sólo las próximas filas para que la ficha del dependiente y lo que se viene
 * queden a la vista; el resto vive acá.
 *
 * Al tocar un item cerramos devolviéndolo: las acciones (ver, editar, cancelar)
 * las resuelve el home del grupo con los action sheets que ya tiene.
 */
@Component({
  selector: 'app-group-reminders-modal',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button type="button" class="auth-back" (click)="close()" aria-label="Cerrar">
            <ion-icon name="close"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow" *ngIf="dependentName">{{ dependentName | titlecase }}</p>
        <h1 class="listing-header__title">{{ title }}</h1>
      </header>

      <div class="grm__list">
        <ng-container *ngFor="let item of items">
          <app-meds-event-item-list
            *ngIf="type === remindersTypes.medications"
            [medEvent]="item"
            (click)="select(item)"
          ></app-meds-event-item-list>
          <app-appointments-item-list
            *ngIf="type === remindersTypes.appointments"
            [appointment]="item"
            (click)="select(item)"
          ></app-appointments-item-list>
          <app-document-item-list
            *ngIf="type === remindersTypes.documents"
            [document]="item"
            (click)="select(item)"
          ></app-document-item-list>
        </ng-container>
      </div>
    </ion-content>
  `,
  styleUrls: ['./group-reminders-modal.component.scss'],
})
export class GroupRemindersModalComponent {
  @Input() items: any[] = [];
  @Input() type: string = REMINDERS_TYPE.appointments;
  @Input() dependentName = '';
  remindersTypes = REMINDERS_TYPE;

  constructor(private modalController: ModalController) {}

  get title(): string {
    return TITLES[this.type] || 'Recordatorios';
  }

  select(item: any) {
    this.modalController.dismiss({ item, type: this.type });
  }

  close() {
    this.modalController.dismiss();
  }
}
