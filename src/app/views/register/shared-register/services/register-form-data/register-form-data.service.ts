import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Injectable({
  providedIn: 'root',
})
export class RegisterFormDataService {
  private registerForm = this.fb.group(
    {
      firstName: [
        null,
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            // Validators.pattern(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/),
          ]),
        ],
      ],
      lastName: [
        null,
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            // Validators.pattern(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/),
          ]),
        ],
      ],
      gender: [null, Validators.required],
      birthday: [null, Validators.required],
      dni: [null, Validators.required],
      email: [
        null,
        [Validators.compose([Validators.required, Validators.email])],
      ],
      password: [null, Validators.required],
      repeatPassword: [null, Validators.required],
    },
    {
      validators: [CustomValidators.passwordMatchValidator],
    }
  );
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  get form() {
    return this.registerForm;
  }

  public personalDataValid(): boolean {
    return (
      this.registerForm.get('firstName').valid &&
      this.registerForm.get('lastName').valid &&
      this.registerForm.get('dni').valid &&
      this.registerForm.get('gender').valid &&
      this.registerForm.get('birthday').valid
    );
  }

  public userDataValid(): boolean {
    return (
      this.registerForm.get('email').valid &&
      this.registerForm.get('password').valid &&
      this.registerForm.get('repeatPassword').valid
    );
  }
}
