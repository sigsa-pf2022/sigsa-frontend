import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Professional,
  ProfessionalsPage,
  ProfessionalsQuery,
} from '../interfaces/Professional.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalsService {
  constructor(private http: HttpClient) {}

  getMyProfessionals(): Promise<Professional[]> {
    return this.http.get<Professional[]>(`${environment.apiUrl}/professionals/my-professionals`).toPromise();
  }

  /** Búsqueda paginada: el backend filtra, ordena (vinculados primero) y pagina. */
  searchProfessionals(query: ProfessionalsQuery): Promise<ProfessionalsPage> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http
      .get<ProfessionalsPage>(`${environment.apiUrl}/professionals`, { params })
      .toPromise();
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
