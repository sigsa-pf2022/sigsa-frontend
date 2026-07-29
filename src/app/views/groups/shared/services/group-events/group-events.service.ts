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

  getHistory(groupId: number | string, limit = 50, offset = 0) {
    return this.http
      .get<any>(`${environment.apiUrl}/group-events/${groupId}/history?limit=${limit}&offset=${offset}`)
      .toPromise();
  }
}
