import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientLink } from '../interfaces/PatientLink.interface';
import { MedicalDocument } from 'src/app/views/documents/shared/interfaces/Document.interface';
import { ProfessionalNote } from 'src/app/interfaces/professional-note';
import { AgendaAppointment, PatientSummary } from '../interfaces/PatientSummary.interface';

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

  getPatientSummary(patientId: number, patientType: string): Promise<PatientSummary> {
    return this.http
      .get<PatientSummary>(
        `${environment.apiUrl}/professionals/patients/${patientId}/summary?patientType=${patientType}`
      )
      .toPromise();
  }

  getPatientNotes(patientId: number, patientType: string): Promise<ProfessionalNote[]> {
    return this.http
      .get<ProfessionalNote[]>(
        `${environment.apiUrl}/professionals/patients/${patientId}/notes?patientType=${patientType}`
      )
      .toPromise();
  }

  createPatientNote(
    patientId: number,
    patientType: string,
    content: string,
  ): Promise<{ note: ProfessionalNote }> {
    return this.http
      .post<{ note: ProfessionalNote }>(
        `${environment.apiUrl}/professionals/patients/${patientId}/notes?patientType=${patientType}`,
        { content }
      )
      .toPromise();
  }

  getAgenda(from?: Date, to?: Date): Promise<AgendaAppointment[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from.toISOString();
    if (to) params.to = to.toISOString();
    return this.http
      .get<AgendaAppointment[]>(`${environment.apiUrl}/professionals/agenda`, { params })
      .toPromise();
  }
}
