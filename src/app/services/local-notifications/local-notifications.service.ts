import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { addSeconds, parseISO, subMinutes } from 'date-fns';
import { DateFormatterService } from '../date-formatter/date-formatter.service';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  private localNotifications = LocalNotifications;
  constructor(private dateFormatterService: DateFormatterService) {}

  async requestPermissions() {
    return await this.localNotifications.requestPermissions();
  }

  registerActionTypes() {
    this.localNotifications.registerActionTypes({
      types: [
        {
          id: 'EVENT',
          actions: [
            {
              id: 'confirm',
              title: 'Confirmar',
            },
            {
              id: 'dismiss',
              title: 'Descartar',
              destructive: true,
            },
          ],
        },
      ],
    });
  }

  addEventListener(callback: CallableFunction) {
    this.localNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {
      callback(notification);
    });
  }

  async schedule(date: string, professional) {
    const subtitle = `Turno: ${this.dateFormatterService.getSpanishFormattedDate(date)}. Doctor: ${
      professional.firstName
    } ${professional.lastName}`;
    await this.localNotifications.schedule({
      notifications: [
        {
          title: 'Recordatorio: Tenes un turno en 15 minutos! 👩🏻‍⚕️',
          body: subtitle,
          id: 1,
          schedule: {
            at: subMinutes(parseISO(date), 15),
          },
          actionTypeId: 'EVENT',
        },
      ],
    });
  }
}
