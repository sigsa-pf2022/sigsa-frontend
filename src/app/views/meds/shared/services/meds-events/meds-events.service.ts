import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedsEventsService {
  constructor(private http: HttpClient) {}

  editAppointment(id, data) {
    return this.http.put(`${environment.apiUrl}/appointments/${id}`, data).toPromise();
  }

  cancelAppointment(id) {
    return this.http.delete(`${environment.apiUrl}/appointments/cancel/${id}`).toPromise();
  }

  confirmAppointment(id) {
    return this.http.put(`${environment.apiUrl}/appointments/confirm/${id}`, {}).toPromise();
  }

  getAppointment(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/appointments/${id}`).toPromise();
  }
  
  getMedsEventsByUser() {
    return this.http.get<any[]>(`${environment.apiUrl}/meds-event`).toPromise();
  }

  createMedEvent(data) {
    return this.http.post(`${environment.apiUrl}/meds-event`, data).toPromise();
  }

  getMeds(): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/meds/all`).toPromise();
  }
}
