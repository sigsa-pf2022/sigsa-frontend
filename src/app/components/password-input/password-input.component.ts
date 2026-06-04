import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-password-input',
  template: `
    <div class="auth-input auth-input--with-suffix">
      <ion-input
        [type]="showPassword ? 'text' : 'password'"
        [formControlName]="this.controlName"
        [placeholder]="this.placeholder"
        [clearOnEdit]="false"
        autocomplete="current-password"
      ></ion-input>
      <button
        type="button"
        class="auth-input__suffix"
        (click)="togglePassword()"
        [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        [attr.aria-pressed]="showPassword"
      >
        <ion-icon [name]="pwdIcon"></ion-icon>
      </button>
    </div>
  `,
  styleUrls: ['./password-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class PasswordInputComponent implements OnInit {
  @Input() controlName: string;
  @Input() placeholder: string;
  control: AbstractControl;
  showPassword = false;
  pwdIcon = 'eye-outline';
  constructor(private formGroupDirective: FormGroupDirective) {}
  togglePassword() {
    this.showPassword = !this.showPassword;
    this.pwdIcon = this.showPassword ? 'eye-off-outline' : 'eye-outline';
  }

  ngOnInit() {
    this.control = this.formGroupDirective.form.get(this.controlName);
  }
}
