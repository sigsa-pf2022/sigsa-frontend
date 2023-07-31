import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { NavController } from '@ionic/angular';

@Injectable()
export class ForbiddenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService, private navController: NavController) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return this._isForbidden(error) ? this._logOut(error) : throwError(error);
      })
    );
  }

  private _isForbidden(httpErrorResponse: HttpErrorResponse): boolean {
    return httpErrorResponse.status === 401;
  }

  private _logOut(error: HttpErrorResponse) {
    this.auth.signOut();
    this.navController.navigateRoot(['welcome']);
    return throwError(error);
  }
}
