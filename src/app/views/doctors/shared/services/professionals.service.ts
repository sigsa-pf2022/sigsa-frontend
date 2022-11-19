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

  getProfessionals(): Promise<Professional[]> {
    return this.http.get<Professional[]>(`${environment.apiUrl}/professionals`).toPromise();
  }

  getProfessionalsSpecializations(): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/professionals/specializations/all`).toPromise();
  }

  createMyProfessional(data): Promise<Professional> {
    return this.http.post<Professional>(`${environment.apiUrl}/professionals/create-my-professional`, data).toPromise();
  }

  createProfessional(data): Promise<Professional> {
    delete data.repeatPassword;
    data.birthday = data.birthday.split('/').reverse().join('-');
    return this.http.post<Professional>(`${environment.apiUrl}/professionals`, data).toPromise();
  }
}
