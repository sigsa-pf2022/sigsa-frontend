import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Injectable({
  providedIn: 'root',
})
export class RegisterFormDataService {
  private userType = 'usuario';
  private data;
  constructor() {}

  isProfessionalType() {
    return this.userType === 'profesional';
  }

  setUserType(type: string) {
    this.userType = type;
  }

  setData(newData) {
    this.data = { ...this.data, ...newData };
  }
  getData() {
    return this.data;
  }
}
