import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  constructor(private http: HttpClient) { }

  getStates(): Promise<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/geography/states/1`).toPromise();
  }
}
