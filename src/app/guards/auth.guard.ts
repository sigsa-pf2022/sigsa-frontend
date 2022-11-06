import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  user: User;
  constructor(private navController: NavController, private auth: AuthenticationService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userLogged = this.auth.user() !== null;
    if (!userLogged) {
      this.navController.navigateRoot(['/welcome']);
    }
    return userLogged;
  }
}
