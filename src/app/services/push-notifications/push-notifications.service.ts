import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import type { Token } from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private currentToken: string | null = null;

  constructor(private http: HttpClient, private platform: Platform) {}

  async initialize(): Promise<void> {
    console.log('[Push] initialize() llamado');
    console.log('[Push] is capacitor:', this.platform.is('capacitor'));
    console.log('[Push] is ios:', this.platform.is('ios'));
    console.log('[Push] is android:', this.platform.is('android'));

    if (!this.platform.is('capacitor')) {
      console.log('[Push] No es Capacitor, saliendo');
      return;
    }

    await this.platform.ready();
    console.log('[Push] Platform lista, pidiendo permisos...');

    const permission = await PushNotifications.requestPermissions();
    console.log('[Push] Permiso resultado:', JSON.stringify(permission));
    if (permission.receive !== 'granted') {
      console.warn('[Push] Permiso denegado:', permission.receive);
      return;
    }

    console.log('[Push] Registrando en APNs/FCM...');
    await PushNotifications.register();

    await PushNotifications.addListener('registration', (token: Token) => {
      console.log('[Push] Token obtenido:', token.value);
      this.currentToken = token.value;
      this.registerWithBackend(token.value);
    });

    await PushNotifications.addListener('registrationError', (error) => {
      console.error('[Push] Registration error:', JSON.stringify(error));
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] Notification received in foreground:', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Push] Notification action performed:', action);
    });
  }

  async deregister(): Promise<void> {
    if (!this.currentToken) return;
    await this.unregisterFromBackend(this.currentToken);
    this.currentToken = null;
    await PushNotifications.removeAllListeners();
  }

  private getPlatform(): 'android' | 'ios' | 'web' {
    if (this.platform.is('android')) return 'android';
    if (this.platform.is('ios')) return 'ios';
    return 'web';
  }

  private getAuthHeaders(): { Authorization: string } | {} {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return {};
    try {
      return { Authorization: `Bearer ${JSON.parse(jwt)}` };
    } catch {
      return {};
    }
  }

  private registerWithBackend(token: string): void {
    this.http
      .post(
        `${environment.apiUrl}/notifications/devices`,
        { token, platform: this.getPlatform() },
        { headers: this.getAuthHeaders() }
      )
      .toPromise()
      .then(() => console.log('[Push] Device registered with backend'))
      .catch((err) => console.error('[Push] Error registering device:', err));
  }

  private unregisterFromBackend(token: string): Promise<any> {
    return this.http
      .delete(`${environment.apiUrl}/notifications/devices/${encodeURIComponent(token)}`, {
        headers: this.getAuthHeaders(),
      })
      .toPromise()
      .catch((err) => console.error('[Push] Error unregistering device:', err));
  }
}
