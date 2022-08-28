import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-creation-acount',
  template: `<div class="modal-content">
    <div class="body">
      <ion-img src="/assets/images/register/success-creation.svg"></ion-img>
      <ion-label class="ui-font-modal-title">¡Felicitaciones su cuenta fue creada con éxito!</ion-label>
      <ion-label class="ui-font-text">Le hemos enviado un email para validar su identidad a su correo electrónico</ion-label>
      <div class="body__actions">
        <ion-button (click)="continue()">Continuar</ion-button>
      </div>
    </div>
  </div>`,
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
