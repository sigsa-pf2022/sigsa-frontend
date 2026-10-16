import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-yes-no-modal',
  template: `
    <div class="app-modal">
      <div
        class="app-modal__icon"
        [class.app-modal__icon--danger]="this.yesColor === 'danger'"
        aria-hidden="true"
      >
        <ion-icon [name]="this.yesColor === 'danger' ? 'alert-circle' : 'help-circle'"></ion-icon>
      </div>
      <h2 class="app-modal__title">{{ this.title }}</h2>
      <p class="app-modal__text">{{ this.text }}</p>
      <p class="app-modal__text app-modal__text--warning" *ngIf="this.subtext">
        {{ this.subtext }}
      </p>

      <div class="app-modal__actions app-modal__actions--row">
        <button type="button" class="auth-btn auth-btn--secondary" (click)="cancel()">
          {{ this.cancelText }}
        </button>
        <button
          type="button"
          class="auth-btn"
          [class.auth-btn--primary]="this.yesColor !== 'danger'"
          [class.auth-btn--danger]="this.yesColor === 'danger'"
          (click)="confirm()"
        >
          {{ this.confirmText }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./yes-no-modal.component.scss'],
})
export class YesNoModalComponent implements OnInit {
  @Input() text: string;
  @Input() title = 'Confirmar acción';
  @Input() confirmText = 'Sí';
  @Input() cancelText = 'No';
  @Input() yesColor: 'primary' | 'danger' = 'danger';
  /**
   * Segunda línea, para lo irreversible. `yesColor` sólo cambiaba el ícono, así
   * que no había forma de distinguir "cancelar el turno" de "borrarlo para
   * siempre": los dos modales se veían igual.
   */
  @Input() subtext: string;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  cancel() {
    this.modalController.dismiss(false);
  }

  confirm() {
    this.modalController.dismiss(true);
  }
}
