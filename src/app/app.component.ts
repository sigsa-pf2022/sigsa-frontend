import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PushNotificationsService } from './services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private pushNotifications: PushNotificationsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.setDefaultLang('es');
    // Si el usuario ya tenía sesión activa, registrar el dispositivo al arrancar
    if (localStorage.getItem('jwt')) {
      this.pushNotifications.initialize();
    }
  }
}
