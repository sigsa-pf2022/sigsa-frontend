import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { parseISO, subMinutes } from 'date-fns';
import { DateFormatterService } from '../date-formatter/date-formatter.service';
import { AppointmentsService } from 'src/app/views/appointments/shared/services/appointments/appointments.service';
import { titleCase } from 'src/app/utils/title-case';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  private localNotifications = LocalNotifications;
  constructor(private dateFormatterService: DateFormatterService, private appointmentsService: AppointmentsService) {}

  async requestPermissions() {
    return await this.localNotifications.requestPermissions();
  }

  /**
   * Muestra una notificación local de forma inmediata.
   * Se usa cuando llega un push con la app en primer plano (foreground),
   * caso en el que Android no dibuja el push en la bandeja automáticamente.
   */
  async showNow(title: string, body: string, extra?: any, actionTypeId?: string) {
    try {
      let perm = await this.localNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        perm = await this.localNotifications.requestPermissions();
        if (perm.display !== 'granted') return;
      }
      await this.localNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 2147483000) + 1, // id único dentro del rango int de Android
            title: title || 'Notificación',
            body: body || '',
            extra: extra || null,
            ...(actionTypeId ? { actionTypeId } : {}),
          },
        ],
      });
    } catch (err) {
      console.error('[LocalNotif] Error mostrando notificación inmediata:', err);
    }
  }

  /**
   * Botones de acción. Sólo existen en notificaciones locales: el plugin de
   * push remoto no los soporta, por eso en primer plano redibujamos el push
   * como notificación local.
   */
  async registerActionTypes() {
    try {
      await this.localNotifications.registerActionTypes({
        types: [
          {
            id: 'GROUP_EVENT',
            actions: [
              {
                id: 'take_charge',
                title: 'Me hago cargo',
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
    } catch (err) {
      console.error('[LocalNotif] Error registrando action types:', err);
    }
  }

  addEventListener(callback: CallableFunction) {
    this.localNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {
      callback(notification);
    });
  }

  async schedule(date: string, professional, idAppointment: number) {
    // El mismo texto se usa para escribir el cuerpo y para reconocer después la
    // notificación que hay que cancelar, así que se arma una sola vez: si se
    // capitaliza sólo de un lado, el matching deja de encontrarla.
    const professionalName = titleCase(
      `${professional.firstName} ${professional.lastName}`,
    );
  
    //Podria ser un getAppointmentStatus que me devuelva directamente el estado y no el registro completo.
    const appointment = await this.appointmentsService.getAppointment(idAppointment);
    if (appointment.status === 'canceled') {
      console.log('Turno cancelado. Eliminando notificación.');
      const pendingNotifications = (await this.localNotifications.getPending()).notifications;
      const notificationDate = subMinutes(parseISO(date), 15).getTime();
      const notificationToCancel = pendingNotifications.find(
        (notification) =>
          notification.schedule.at.getTime() === notificationDate &&
          notification.body.includes(professionalName)
      );

      if (notificationToCancel) {
        await this.localNotifications.cancel({ notifications: [{ id: notificationToCancel.id }] });
        console.log('Notificación cancelada.');
      } else {
        console.log('No se encontró una notificación para cancelar.');
      }
    } else {
      
      const subtitle = `Turno: ${this.dateFormatterService.getSpanishFormattedDate(
        date,
      )}. Doctor: ${professionalName}`;
  
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
  async scheduleMedEvent(date: string, med) {
    const subtitle = `Fecha: ${this.dateFormatterService.getSpanishFormattedDate(date)}. Medicamento: ${med.name} `;
    await this.localNotifications.schedule({
      notifications: [
        {
          title: 'Recordatorio: Tenes que tomar tu medicamento en 5 minutos!',
          body: subtitle,
          id: 1,
          schedule: {
            at: subMinutes(parseISO(date), 5),
          },
          actionTypeId: 'EVENT',
        },
      ],
    });
  }
}
