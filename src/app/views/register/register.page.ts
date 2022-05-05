import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm = this.fb.group({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.registerForm.value);
  }

}
