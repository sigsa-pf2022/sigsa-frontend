import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Professional } from '../interfaces/Professional.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalsService {
  constructor(private http: HttpClient) {}

  getMyProfessionals(): Promise<Professional[]> {
    return this.http.get<Professional[]>(`${environment.apiUrl}/professionals/my-professionals`).toPromise();
  }

  createMyProfessional(data): Promise<Professional> {
    return this.http.post<Professional>(`${environment.apiUrl}/professionals/create`, data).toPromise();
  }
}
