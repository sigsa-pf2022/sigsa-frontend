import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import type { Token } from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';
import { LocalNotificationsService } from '../local-notifications/local-notifications.service';
import { GroupEventsService } from 'src/app/views/groups/shared/services/group-events/group-events.service';
import { ToastService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private currentToken: string | null = null;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private localNotifications: LocalNotificationsService,
    private groupEventsService: GroupEventsService,
    private toastService: ToastService,
    private navController: NavController,
  ) {}

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

    // Botones nativos ("Me hago cargo" / "Descartar") en la notificación local
    // con la que redibujamos el push en primer plano.
    await this.localNotifications.registerActionTypes();
    this.localNotifications.addEventListener((action: any) =>
      this.handleLocalAction(action),
    );

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] Notification received in foreground:', notification);
      // Con la app en primer plano Android no muestra el push en la bandeja,
      // así que lo dibujamos manualmente como notificación local. De paso, la
      // notificación local sí soporta botones de acción; el push remoto no.
      this.localNotifications.showNow(
        notification.title ?? 'Notificación',
        notification.body ?? '',
        notification.data,
        this.isActionable(notification.data) ? 'GROUP_EVENT' : undefined,
      );
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Push] Notification action performed:', action);
      // En segundo plano la bandeja no ofrece botones (límite del plugin de
      // push remoto), así que al tocarla abrimos el evento, donde está el
      // botón "Me hago cargo".
      this.openEvent(action?.notification?.data);
    });
  }

  /** El backend marca así los eventos de un dependiente, que son accionables. */
  private isActionable(data: any): boolean {
    return String(data?.actionable) === 'true';
  }

  /** Respuesta desde los botones nativos de la notificación local. */
  private async handleLocalAction(action: any) {
    const data = action?.notification?.extra;
    if (!data?.notificationId) return;

    if (action.actionId === 'take_charge' || action.actionId === 'dismiss') {
      try {
        await this.groupEventsService.respond(
          Number(data.notificationId),
          action.actionId === 'take_charge' ? 'take_charge' : 'discard',
        );
        if (action.actionId === 'take_charge') {
          this.toastService.showSuccess('Avisamos al grupo que te hacés cargo.');
        }
      } catch ({ error }) {
        this.toastService.showError(error?.message || 'No pudimos registrar la acción');
      }
      return;
    }

    // 'tap' o cualquier otra: abrir el evento.
    this.openEvent(data);
  }

  /** Deep link al turno o medicamento que originó la notificación. */
  private openEvent(data: any) {
    if (!data?.type || !data?.referenceId) return;

    const queryParams: any = {};
    if (data.groupId) queryParams.groupId = data.groupId;
    if (data.dependentId) queryParams.dependentId = data.dependentId;
    if (data.dependentName) queryParams.dependentName = data.dependentName;

    // event_taken_charge apunta al mismo evento; el tipo original viaja aparte.
    const type = data.type === 'event_taken_charge' ? data.originalType : data.type;

    if (type === 'medication') {
      this.navController.navigateForward([`/meds/view/${data.referenceId}`], { queryParams });
    } else if (type === 'appointment') {
      this.navController.navigateForward([`/appointments/view/${data.referenceId}`], { queryParams });
    }
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
