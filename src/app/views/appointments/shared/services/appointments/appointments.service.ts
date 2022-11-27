import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}

  createAppointment(data) {
    return this.http.post(`${environment.apiUrl}/appointments/create`, data).toPromise();
  }

  editAppointment(data) {
    return this.http.put(`${environment.apiUrl}/appointments/update`, data).toPromise();
  }

  cancelAppointment(id) {
    return this.http.delete(`${environment.apiUrl}/appointments/cancel/${id}`).toPromise();
  }

  getAppointmentsByUser() {
    return this.http.get<any[]>(`${environment.apiUrl}/appointments`).toPromise();
  }

  getAppointment(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/appointments/${id}`).toPromise();
  }
}
