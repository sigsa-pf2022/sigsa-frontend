import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}
  getEvents(): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/events`).toPromise();
  }
}
