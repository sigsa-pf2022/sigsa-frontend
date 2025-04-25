import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { parseISO, subMinutes } from 'date-fns';
import { DateFormatterService } from '../date-formatter/date-formatter.service';
import { AppointmentsService } from 'src/app/views/appointments/shared/services/appointments/appointments.service';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  private localNotifications = LocalNotifications;
  constructor(private dateFormatterService: DateFormatterService, private appointmentsService: AppointmentsService) {}

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

  async schedule(date: string, professional, idAppointment: number) {
  
    //Podria ser un getAppointmentStatus que me devuelva directamente el estado y no el registro completo.
    const appointment = await this.appointmentsService.getAppointment(idAppointment);
    if (appointment.status === 'canceled') {
      console.log('Turno cancelado. Eliminando notificación.');
      const pendingNotifications = (await this.localNotifications.getPending()).notifications;
      const notificationDate = subMinutes(parseISO(date), 15).getTime();
      const notificationToCancel = pendingNotifications.find(
        (notification) =>
          notification.schedule.at.getTime() === notificationDate &&
          notification.body.includes(professional.firstName) &&
          notification.body.includes(professional.lastName)
      );

      if (notificationToCancel) {
        await this.localNotifications.cancel({ notifications: [{ id: notificationToCancel.id }] });
        console.log('Notificación cancelada.');
      } else {
        console.log('No se encontró una notificación para cancelar.');
      }
    } else {
      
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
