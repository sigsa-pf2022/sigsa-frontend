import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: User;
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public navController: NavController
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.userData = user && user.emailVerified ? user : null;
      localStorage.setItem('user', JSON.stringify(this.userData));
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
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.sendVerificationMail();
      this.setUserData(result.user);
    } catch (error) {
      window.alert(error.message);
    }
  }
  // Sign in with email/password
  async signIn(params) {
    const { email, password } = params;
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return result.user;
    } catch (error) {
      return error;
    }
  }

  async signOut(){
    return this.afAuth.signOut();
  }
  async sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        // this.router.navigate(['verify-email-address']);
      });
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}
