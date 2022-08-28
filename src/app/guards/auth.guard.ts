import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  user: User;
  constructor(private navController: NavController){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    const userVerified = !!this.user && this.user?.emailVerified;
    console.log(userVerified);
    if(userVerified){
      return true;
    }
    this.navController.navigateRoot(['welcome']);
    return false;
  }
}
