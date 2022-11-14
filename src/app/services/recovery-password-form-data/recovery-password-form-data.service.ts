import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RecoveryPasswordFormDataService {
  private _tokenForm = this.fb.group({
    email: [null, [Validators.compose([Validators.required, Validators.email])]],
    code: [null, Validators.compose([Validators.required, Validators.min(100000), Validators.max(999999)])],
    field: 'recoveryPasswordToken',
  });

  private _resetPasswordForm = this.fb.group({
    email: [null, [Validators.compose([Validators.required, Validators.email])]],
    password: [null, [Validators.required, Validators.minLength(6)]],
    repeatPassword: [null, [Validators.required, Validators.minLength(6)]],
  });
  constructor(private fb: FormBuilder) {}

  get tokenForm() {
    return this._tokenForm;
  }

  get resetPasswordForm() {
    return this._resetPasswordForm;
  }

  get isResetPasswordFormValid() {
    return (
      this._resetPasswordForm.valid &&
      this._resetPasswordForm.get('password').value === this._resetPasswordForm.get('repeatPassword').value
    );
  }
}
