import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

/**
 * Deja pasar sólo a profesionales. Antes `/patients` sólo exigía estar logueado
 * y un paciente podía abrir la pantalla (el backend igual le rebotaba los datos).
 */
@Injectable({
  providedIn: 'root',
})
export class ProfessionalGuard implements CanActivate {
  constructor(private navController: NavController, private auth: AuthenticationService) {}

  canActivate(): boolean | UrlTree {
    const user = this.auth.user();
    if (!user) {
      this.navController.navigateRoot(['/welcome']);
      return false;
    }
    if (user.role !== 'professional') {
      this.navController.navigateRoot(['/tabs']);
      return false;
    }
    return true;
  }
}
