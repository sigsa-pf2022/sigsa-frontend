import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

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
          <ion-button (click)="close()">Cerrar</ion-button>
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
    private auth: AuthenticationService,
    private toast: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  close() {
    return this.modalController.dismiss();
  }

  async send() {
    await this.auth
      .sendPasswordResetEmail(this.form.value)
      .then((res) => {
        this.showMessage('success', 'success');
        this.close();
      })
      .catch((err) => {
        this.showMessage('danger', err);
      });
  }

  async showMessage(color: string, code: string) {
    const toast = await this.toast.create({
      message: this.translate.instant(`login.recovery-password.${code}`),
      duration: 5000,
      color,
    });
    await toast.present();
  }
}
