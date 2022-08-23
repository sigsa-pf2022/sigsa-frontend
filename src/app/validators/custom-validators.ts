import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomValidatorErrors } from './custom-validator-errors';

export class CustomValidators {
  static passwordMatchValidator(
    control: AbstractControl,
    pass: string = 'password',
    rPass: string = 'repeatPassword'
  ): ValidationErrors | null {
    return CustomValidators.fieldsMatchValidator(control, pass, rPass, CustomValidatorErrors.noPasswordMatch);
  }

  static fieldsMatchValidator(
    control: AbstractControl,
    controlName1: string,
    controlName2: string,
    error: ValidationErrors
  ): ValidationErrors | null {
    const field1: string = control.get(controlName1).value;
    const field2: string = control.get(controlName2).value;
    if (field1 !== field2) {
      control.get(controlName2).setErrors(error);
      return error;
    } else {
      control.get(controlName2).setErrors(null);
    }
  }
}
