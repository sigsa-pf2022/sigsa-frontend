import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authState = new Observable();
  private userData: User;
  constructor(
    public afAuth: AngularFireAuth,
    public navController: NavController,
    private http: HttpClient
  ) {
    // this.afAuth.authState.subscribe((user) => {
    //   if (user) {
    //     if (user.emailVerified) {
    //       this.userData = user;
    //       localStorage.setItem('user', JSON.stringify(this.userData));
    //     }
    //   } else {
    //     localStorage.setItem('user', null);
    //   }
    // });
  }

  user() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  saveUser(data) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('jwt', JSON.stringify(data.access_token));
  }

  deleteUser() {
    localStorage.setItem('user', null);
  }
  emailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified;
  }
  // Sign up with email/password
  async signUp(email, password) {
    await this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail();
      })
      .catch((error) => {
        throw error.code.split('/')[1];
      });
  }

  async sendPasswordResetEmail(formValue) {
    return await this.afAuth
      .sendPasswordResetEmail(formValue.email)
      .then((result) => result)
      .catch((error) => {
        throw error.code.split('/')[1];
      });
  }
  // Sign in with email/password
  async signIn(params) {
    const res = await this.http
      .post(`${environment.apiUrl}/auth/login`, params)
      .toPromise();
    this.saveUser(res);
    return res;
    // const { email, password } = params;
    // return await this.afAuth
    //   .signInWithEmailAndPassword(email, password)
    //   .then((result) => result.user)
    //   .catch((error) => {
    //     throw error.code.split('/')[1];
    //   });
  }
  async signOut() {
    return this.afAuth.signOut();
  }
  async sendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification({
      url: 'https://sisga.page.link/recovery-password',
      iOS: { bundleId: 'com.sigsa.sigsa' },
      handleCodeInApp: true,
    });
  }
}
