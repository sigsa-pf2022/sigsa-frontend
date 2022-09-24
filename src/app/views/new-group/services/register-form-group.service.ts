import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Injectable({
  providedIn: 'root'
})
export class RegisterFormGroupService {
  private registerForm = this.fb.group(
    {
      nameGroup: [
        null,
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            // Validators.pattern(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/),
          ]),
        ],
      ],
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
      dni: [
        null,
        [
          Validators.compose([
            Validators.required,
            Validators.min(1000000),
            // Validators.pattern(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/),
          ]),
        ] 
      ],
      bloodType: [null, Validators.required],
      birthday: [null, Validators.required],
    },
    {
      validators: [CustomValidators.passwordMatchValidator],
    }
  );

  constructor(private fb: FormBuilder, private http: HttpClient) { }
  get form() {
    return this.registerForm;
  }

  public groupDataValid(): boolean {
    return (
      this.registerForm.get('nameGroup').valid &&
      this.registerForm.get('firstName').valid &&
      this.registerForm.get('lastName').valid &&
      this.registerForm.get('dni').valid &&
      this.registerForm.get('bloodType').valid &&
      this.registerForm.get('birthday').valid 
    );
  }

}
