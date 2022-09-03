import { Component, ContentChild, OnInit } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-password-input',
  template: `
    <ng-content></ng-content>
    <a class="type-toggle" (click)="toggleShow()">
      <ion-icon
        class="show-option"
        [hidden]="showPassword"
        name="eye-off-outline"
      ></ion-icon>

      <ion-icon
        class="hide-option"
        [hidden]="!showPassword"
        name="eye-outline"
      ></ion-icon>
    </a>
  `,
  styleUrls: ['./password-input.component.scss'],
})
export class PasswordInputComponent implements OnInit {
  @ContentChild(IonInput) input: IonInput;
  showPassword = false;
  constructor() {}
  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }

  ngOnInit() {}
}
