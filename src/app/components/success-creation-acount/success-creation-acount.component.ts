import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-creation-acount',
  template: `
    <div class="app-modal">
      <div class="app-modal__icon app-modal__icon--success" aria-hidden="true">
        <ion-icon name="checkmark-circle"></ion-icon>
      </div>
      <h2 class="app-modal__title">¡Cuenta creada!</h2>
      <p class="app-modal__text">
        Te enviamos un email para validar tu identidad. Revisá tu casilla para activar la cuenta.
      </p>

      <div class="app-modal__actions">
        <button type="button" class="auth-btn auth-btn--primary" (click)="continue()">
          Continuar
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./success-creation-acount.component.scss'],
})
export class SuccessCreationAcountComponent implements OnInit {
  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  continue() {
    this.modalController.dismiss();
    return this.navController.navigateRoot(['login']);
  }

}
