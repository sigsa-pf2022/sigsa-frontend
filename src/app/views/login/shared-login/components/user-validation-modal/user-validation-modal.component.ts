import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-user-validation-modal',
  template: `
    <form [formGroup]="this.form" (submit)="onSubmit()">
      <div class="app-modal">
        <div class="app-modal__icon" aria-hidden="true">
          <ion-icon name="key"></ion-icon>
        </div>
        <h2 class="app-modal__title">Verificá tu cuenta</h2>
        <p class="app-modal__text">
          Te enviamos un código de 6 dígitos a tu correo electrónico. Ingresalo para continuar.
        </p>

        <div class="app-modal__form">
          <div class="auth-field">
            <label class="auth-field__label" for="uv-code">Código</label>
            <div class="auth-input">
              <ion-input
                id="uv-code"
                class="code-input"
                formControlName="code"
                type="number"
                inputmode="numeric"
                placeholder="000000"
                maxlength="6"
              ></ion-input>
            </div>
          </div>
        </div>

        <div class="app-modal__actions">
          <button
            type="button"
            class="auth-btn auth-btn--primary"
            (click)="onSubmit()"
            [disabled]="!this.form.valid"
          >
            Validar
          </button>
        </div>

        <button type="submit" hidden></button>
      </div>
    </form>
  `,
  styleUrls: ['./user-validation-modal.component.scss'],
})
export class UserValidationModalComponent implements OnInit {
  @Input() email: string;
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private modalController: ModalController) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: this.email,
      code: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(100000),
          Validators.max(999999),
        ]),
      ],
      field: 'verificationCode'
    });
  }

  async onSubmit() {
    if (!this.form.valid) return;
    return await this.auth
      .validateCode(this.form.value)
      .then(() => {
        this.modalController.dismiss('success');
      })
      .catch(({ error }) => {
        this.modalController.dismiss(error);
      });
  }
}
