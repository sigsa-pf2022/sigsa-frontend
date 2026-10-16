import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export type GroupEventResponseAction = 'take_charge' | 'discard';

@Injectable({
  providedIn: 'root',
})
export class GroupEventsService {
  constructor(private http: HttpClient) {}

  /** Responder a una push, que trae el id de la notificación. */
  respond(notificationId: number, action: GroupEventResponseAction) {
    return this.http
      .post<any>(`${environment.apiUrl}/group-events/notifications/${notificationId}/respond`, { action })
      .toPromise();
  }

  /** Responder desde adentro de la app, donde conocemos el evento. */
  respondToEvent(
    targetType: 'med_event' | 'appointment',
    targetId: number,
    action: GroupEventResponseAction
  ) {
    return this.http
      .post<any>(`${environment.apiUrl}/group-events/events/${targetType}/${targetId}/respond`, { action })
      .toPromise();
  }

  /**
   * Qué respondió el usuario sobre cada evento: { [id]: 'discard' | 'take_charge' | null }.
   * Sirve para no volver a ofrecer "No puedo" a quien ya lo dijo.
   */
  getMyResponses(targetType: 'med_event' | 'appointment', ids: number[]) {
    return this.http
      .get<Record<number, string | null>>(
        `${environment.apiUrl}/group-events/events/${targetType}/my-responses?ids=${ids.join(',')}`
      )
      .toPromise();
  }

  getHistory(groupId: number | string, limit = 50, offset = 0) {
    return this.http
      .get<any>(`${environment.apiUrl}/group-events/${groupId}/history?limit=${limit}&offset=${offset}`)
      .toPromise();
  }
}
