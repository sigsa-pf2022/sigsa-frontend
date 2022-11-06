import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public navController: NavController, private http: HttpClient) {}

  user() {
    return JSON.parse(localStorage.getItem('user'));
  }

  userToken() {
    return JSON.parse(localStorage.getItem('jwt'));
  }

  saveUser(data) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('jwt', JSON.stringify(data.access_token));
  }

  deleteUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
  }

  emailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified;
  }

  async signUp(params) {
    delete params.repeatPassword;
    params.birthday = params.birthday.split('/').reverse().join('-');
    const res = await this.http.post(`${environment.apiUrl}/users/create`, params).toPromise();
    return res;
  }

  validateCode(data) {
    return this.http.post(`${environment.apiUrl}/users/validate`, data).toPromise();
  }

  // TODO: Page to reset password
  async sendPasswordResetEmail(formValue) {
    // return await this.afAuth
    //   .sendPasswordResetEmail(formValue.email)
    //   .then((result) => result)
    //   .catch((error) => {
    //     throw error.code.split('/')[1];
    //   });
  }

  async signIn(params) {
    const res = await this.http.post(`${environment.apiUrl}/auth/login`, params).toPromise();
    this.saveUser(res);
    return res;
  }

  getUserByUsername(value: number): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/${value}`).toPromise();
  }

  signOut() {
    return this.deleteUser();
  }
}
