import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientLink } from '../interfaces/PatientLink.interface';
import { MedicalDocument } from 'src/app/views/documents/shared/interfaces/Document.interface';

export interface PatientsResponse {
  patients: PatientLink[];
  pendingRequests: PatientLink[];
}

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(private http: HttpClient) {}

  getPatients(): Promise<PatientsResponse> {
    return this.http
      .get<PatientsResponse>(`${environment.apiUrl}/professionals/patients`)
      .toPromise();
  }

  linkPatient(patientId: number, patientType: string): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/professionals/patients`, { patientId, patientType })
      .toPromise();
  }

  unlinkPatient(patientId: number, patientType: string): Promise<any> {
    return this.http
      .delete(
        `${environment.apiUrl}/professionals/patients/${patientId}?patientType=${patientType}`
      )
      .toPromise();
  }

  getPatientDocuments(patientId: number, patientType: string): Promise<MedicalDocument[]> {
    return this.http
      .get<MedicalDocument[]>(
        `${environment.apiUrl}/professionals/patients/${patientId}/documents?patientType=${patientType}`
      )
      .toPromise();
  }
}
