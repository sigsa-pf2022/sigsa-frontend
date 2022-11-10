import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private http: HttpClient) {}

  createAppointment(data){
    return this.http.post(`${environment.apiUrl}/appointments/create`, data).toPromise();
  }

  getAppointmentsByUser(){
    return this.http.get<any[]>(`${environment.apiUrl}/appointments`).toPromise();
  }
}
