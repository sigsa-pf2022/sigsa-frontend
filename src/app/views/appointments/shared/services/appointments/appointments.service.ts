import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private http: HttpClient) {}

  createAppointment(data){
    data.date = data.date.split('/').reverse().join('-');
    return this.http.post(`${environment.apiUrl}/appointments/create`, data).toPromise();
  }
}
