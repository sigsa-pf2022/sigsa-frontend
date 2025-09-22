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

  getMedsEventsByDependent(dependentId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/meds-event/dependent/${dependentId}`).toPromise();
  }

  createMedEvent(data) {
    // Normalizar payload: aceptar data.med (objeto) o data.medId (número)
    let payload = data;
    if (data && !data.medId && data.med && typeof data.med === 'object' && 'id' in data.med) {
      payload = { medId: data.med.id, date: data.date };
    }
    return this.http.post(`${environment.apiUrl}/meds-event`, payload).toPromise();
  }

  createMedEventForDependent(dependentId: number, data) {
    let payload = data;
    if (data && !data.medId && data.med && typeof data.med === 'object' && 'id' in data.med) {
      payload = { medId: data.med.id, date: data.date };
    }
    return this.http.post(`${environment.apiUrl}/meds-event/dependent/${dependentId}`, payload).toPromise();
  }

  getMeds(): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/meds/all`).toPromise();
  }
}
