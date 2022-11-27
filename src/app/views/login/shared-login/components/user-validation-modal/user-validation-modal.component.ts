import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-user-validation-modal',
  template: `
    <form [formGroup]="this.form">
      <div class="modal-content">
        <div class="body">
          <ion-label class="ui-font-profile-label"
            >Le hemos enviado un código de validación a su correo electrónico</ion-label
          >
          <ion-img class="uv__img" src="/assets/images/register/user-validation.svg"></ion-img>
          <ion-input class="ui-form-input" formControlName="code" type="number"></ion-input>
          <div class="body__actions">
            <ion-button expand="block" (click)="onSubmit()" [disabled]="!this.form.valid">Validar</ion-button>
          </div>
        </div>
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
