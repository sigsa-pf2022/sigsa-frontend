import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-password-input',
  template: `
    <ion-input
      [type]="showPassword ? 'text' : 'password'"
      class="ui-form-input pi__input"
      [formControlName]="this.controlName"
      [placeholder]="this.placeholder"
      [clearOnEdit]="false"
    ></ion-input>
    <ion-icon
      class="pi__icon"
      color="medium"
      slot="end"
      [name]="pwdIcon"
      (click)="togglePassword()"
    >
    </ion-icon>
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
