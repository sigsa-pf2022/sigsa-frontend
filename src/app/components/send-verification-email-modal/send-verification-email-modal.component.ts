import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-send-verification-email-modal',
  template: `<div class="modal-content">
    <div class="body">
      <ion-title>Atencion!</ion-title>
      <ion-label
        >La cuenta debe confirmar el correo para continuar. Revise la casilla de
        correo o solicite un reenvio</ion-label
      >
      <div class="body__actions">
        <ion-button (click)="close()">Cerrar</ion-button>
        <ion-button (click)="resend()">Reenviar</ion-button>
      </div>
    </div>
  </div>`,
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
