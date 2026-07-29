import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  /**
   * Usuario actual, para las vistas que no pueden releer localStorage por su
   * cuenta. El header, por ejemplo, vive en el shell de tabs y no se recrea al
   * navegar, así que no le sirve `ionViewWillEnter`.
   */
  private readonly userSubject = new BehaviorSubject<any>(this.readUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(
    public navController: NavController,
    private http: HttpClient,
    private pushNotifications: PushNotificationsService
  ) {}

  user() {
    return this.readUser();
  }

  private readUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

  userToken() {
    return JSON.parse(localStorage.getItem('jwt'));
  }

  saveUser(data) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('jwt', JSON.stringify(data.access_token));
    this.userSubject.next(data.user);
  }

  deleteUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.userSubject.next(null);
  }

  /**
   * Refresca sólo el usuario guardado, conservando el token.
   * Se usa después de editar "Mis datos": las vistas leen `user()` de
   * localStorage, así que si no se reescribe siguen mostrando lo viejo.
   */
  updateStoredUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  updateMe(data): Promise<any> {
    return this.http.patch<any>(`${environment.apiUrl}/users/me`, data).toPromise();
  }

  emailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified;
  }

  signUp(params) {
    delete params.repeatPassword;
    params.birthday = params.birthday.split('/').reverse().join('-');
    return this.http.post(`${environment.apiUrl}/users/create`, params).toPromise();
  }

  userStatus(email: string) {
    return this.http.get(`${environment.apiUrl}/users/status?email=${email}`).toPromise();
  }

  validateCode(data) {
    return this.http.post(`${environment.apiUrl}/users/validate`, data).toPromise();
  }

  sendPasswordResetEmail(email) {
    return this.http.post(`${environment.apiUrl}/users/recovery-password-email`, { email }).toPromise();
  }

  resetPassword(data) {
    return this.http.post(`${environment.apiUrl}/users/reset-password`, data).toPromise();
  }

  async signIn(params) {
    const res = await this.http.post(`${environment.apiUrl}/auth/login`, params).toPromise();
    this.saveUser(res);
    this.pushNotifications.initialize();
    return res;
  }

  getUserByDni(value: number): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/${value}`).toPromise();
  }

  getDependentByDni(dni: string): Promise<any[]> {
    return this.http
      .get<any[]>(`${environment.apiUrl}/family-groups/dependents/search?dni=${dni}`)
      .toPromise();
  }

  async signOut() {
    await this.pushNotifications.deregister();
    return this.deleteUser();
  }
}
