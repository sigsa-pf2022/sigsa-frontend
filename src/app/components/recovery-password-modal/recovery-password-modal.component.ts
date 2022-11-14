import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-password-modal',
  template: `<div class="modal-content">
    <form [formGroup]="this.form">
      <div class="body">
        <ion-title>Recuperación de contraseña</ion-title>
        <ion-label
          >Le enviaremos un email para que pueda recuerar su contraseña a la
          direccion ingresada debajo</ion-label
        >
        <ion-input
          class="ui-form-input"
          placeholder="Email"
          formControlName="email"
        ></ion-input>
        <div class="body__actions">
          <ion-button color='medium' (click)="close()">Cerrar</ion-button>
          <ion-button (click)="send()" [disabled]="!this.form.valid"
            >Enviar</ion-button
          >
        </div>
      </div>
    </form>
  </div>`,
  styleUrls: ['./recovery-password-modal.component.scss'],
})
export class RecoveryPasswordModalComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {}

  close() {
    return this.modalController.dismiss();
  }

  send() {
    return this.modalController.dismiss(this.form.value);
  }
}
