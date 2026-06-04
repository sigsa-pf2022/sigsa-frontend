import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-password-modal',
  template: `
    <div class="app-modal">
      <div class="app-modal__icon" aria-hidden="true">
        <ion-icon name="mail"></ion-icon>
      </div>
      <h2 class="app-modal__title">Recuperar contraseña</h2>
      <p class="app-modal__text">
        Te enviamos un código por email para que puedas crear una nueva contraseña.
      </p>

      <form class="app-modal__form" [formGroup]="this.form" (submit)="send()">
        <div class="auth-field">
          <label class="auth-field__label" for="rp-email">Email</label>
          <div class="auth-input">
            <ion-input
              id="rp-email"
              placeholder="tu@email.com"
              formControlName="email"
              type="email"
              inputmode="email"
              autocomplete="email"
            ></ion-input>
          </div>
        </div>
        <button type="submit" hidden></button>
      </form>

      <div class="app-modal__actions app-modal__actions--row">
        <button type="button" class="auth-btn auth-btn--secondary" (click)="close()">
          Cerrar
        </button>
        <button
          type="button"
          class="auth-btn auth-btn--primary"
          (click)="send()"
          [disabled]="!this.form.valid"
        >
          Enviar
        </button>
      </div>
    </div>
  `,
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
    if (!this.form.valid) return;
    return this.modalController.dismiss(this.form.value);
  }
}
