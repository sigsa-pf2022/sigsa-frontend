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
          <ion-input class="ui-form-input" formControlName="veficationCode" type="string"></ion-input>
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
      veficationCode: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern(/^[0-9]\d*$/),
        ]),
      ],
      email: this.email,
    });
  }

  async onSubmit() {
    return await this.auth
      .validateCode(this.form.value)
      .then(() => {
        this.modalController.dismiss('success');
      })
      .catch(({error}) => {
        this.modalController.dismiss(error);
      });
  }
}
