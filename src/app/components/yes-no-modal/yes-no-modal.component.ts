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

      <div class="app-modal__actions app-modal__actions--row">
        <button type="button" class="auth-btn auth-btn--secondary" (click)="cancel()">
          {{ this.cancelText }}
        </button>
        <button type="button" class="auth-btn auth-btn--primary" (click)="confirm()">
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
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  cancel() {
    this.modalController.dismiss(false);
  }

  confirm() {
    this.modalController.dismiss(true);
  }
}
