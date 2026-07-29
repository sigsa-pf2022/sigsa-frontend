import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedsEventsService {
  constructor(private http: HttpClient) {}

  getMedsEventsByUser() {
    return this.http.get<any[]>(`${environment.apiUrl}/meds-event`).toPromise();
  }

  getMedsEventsByDependent(dependentId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/meds-event/dependent/${dependentId}`).toPromise();
  }

  getMedEvent(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/meds-event/${id}`).toPromise();
  }

  /**
   * Tomas agrupadas por tratamiento: una entrada por serie con su próxima
   * toma. Las tomas únicas vienen con la misma forma (totalDoses: 1).
   */
  getTreatmentsByUser() {
    return this.http.get<any[]>(`${environment.apiUrl}/meds-event/treatments`).toPromise();
  }

  getTreatmentsByDependent(dependentId: number) {
    return this.http
      .get<any[]>(`${environment.apiUrl}/meds-event/treatments/dependent/${dependentId}`)
      .toPromise();
  }

  cancelTreatment(seriesId: string) {
    return this.http
      .patch<any>(`${environment.apiUrl}/meds-event/treatments/${seriesId}/cancel`, {})
      .toPromise();
  }

  cancelTreatmentForDependent(seriesId: string, dependentId: number) {
    return this.http
      .patch<any>(
        `${environment.apiUrl}/meds-event/treatments/${seriesId}/dependent/${dependentId}/cancel`,
        {}
      )
      .toPromise();
  }

  createMedEvent(data) {
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

  editMedEvent(id: number, data: { medId?: number; date?: string }) {
    let payload: any = data;
    if (data && !data.medId && (data as any).med && typeof (data as any).med === 'object' && 'id' in (data as any).med) {
      payload = { medId: (data as any).med.id, date: (data as any).date };
    }
    return this.http.patch<any>(`${environment.apiUrl}/meds-event/${id}`, payload).toPromise();
  }

  cancelMedEvent(id: number) {
    return this.http.patch<any>(`${environment.apiUrl}/meds-event/${id}/cancel`, {}).toPromise();
  }

  confirmMedEvent(id: number) {
    return this.http.patch<any>(`${environment.apiUrl}/meds-event/${id}/confirm`, {}).toPromise();
  }

  getMeds(): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/meds/all`).toPromise();
  }
}
