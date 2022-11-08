import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AlreadyLoggedGuard implements CanActivate {
  constructor(private navController: NavController, private auth: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userLogged = this.auth.user() !== null;
    console.log(userLogged);
    if (userLogged) {
      this.navController.navigateRoot(['/tabs/home']);
      return userLogged;
    }
    return !userLogged;
  }
}
