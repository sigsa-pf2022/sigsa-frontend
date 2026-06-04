import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-send-verification-email-modal',
  template: `
    <div class="app-modal">
      <div class="app-modal__icon app-modal__icon--warning" aria-hidden="true">
        <ion-icon name="mail-unread"></ion-icon>
      </div>
      <h2 class="app-modal__title">Verificá tu correo</h2>
      <p class="app-modal__text">
        Antes de continuar, confirmá tu cuenta desde el email que te enviamos. Si no llegó, podés solicitar un reenvío.
      </p>

      <div class="app-modal__actions app-modal__actions--row">
        <button type="button" class="auth-btn auth-btn--secondary" (click)="close()">
          Cerrar
        </button>
        <button type="button" class="auth-btn auth-btn--primary" (click)="resend()">
          Reenviar
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./send-verification-email-modal.component.scss'],
})
export class SendVerificationEmailModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    return this.modalController.dismiss();
  }

  resend() {
    return this.modalController.dismiss('resend');
  }
}
