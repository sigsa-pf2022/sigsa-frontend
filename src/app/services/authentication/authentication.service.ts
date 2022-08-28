import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: User;
  constructor(
    public afAuth: AngularFireAuth,
    public navController: NavController
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        if (user.emailVerified) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          this.navController.navigateRoot(['tabs/home']);
        }
      }
    });
  }

  user() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
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
  // Sign in with email/password
  async signIn(params) {
    const { email, password } = params;
    return await this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => result.user)
      .catch((error) => {
        throw error.code.split('/')[1];
      });
  }
  async signOut() {
    return this.afAuth.signOut();
  }
  async sendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }
}
