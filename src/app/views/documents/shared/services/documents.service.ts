import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  MedicalDocument,
  CreateDocumentDTO,
  EditDocumentDTO,
  DocumentWithContent,
} from '../interfaces/Document.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documentsChanged = new Subject<void>();
  /** Emite cada vez que se crea, edita o elimina un documento para refrescar los listados. */
  documentsChanged$ = this.documentsChanged.asObservable();

  constructor(private http: HttpClient) {}

  notifyDocumentsChanged() {
    this.documentsChanged.next();
  }

  createDocument(data: CreateDocumentDTO) {
    return this.http
      .post(`${environment.apiUrl}/documents`, data)
      .toPromise();
  }

  createDocumentForDependent(dependentId: number, data: CreateDocumentDTO) {
    return this.http
      .post(`${environment.apiUrl}/documents/dependent/${dependentId}`, data)
      .toPromise();
  }

  editDocument(id: number, data: EditDocumentDTO) {
    return this.http
      .put(`${environment.apiUrl}/documents/${id}`, data)
      .toPromise();
  }

  deleteDocument(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/documents/${id}`)
      .toPromise();
  }

  cancelDocument(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/documents/cancel/${id}`)
      .toPromise();
  }

  getDocumentsByUser() {
    return this.http
      .get<MedicalDocument[]>(`${environment.apiUrl}/documents`)
      .toPromise();
  }

  getDocumentsByDependent(dependentId: number) {
    return this.http
      .get<MedicalDocument[]>(
        `${environment.apiUrl}/documents/dependent/${dependentId}`
      )
      .toPromise();
  }

  getDocument(id: number) {
    return this.http
      .get<MedicalDocument>(`${environment.apiUrl}/documents/${id}`)
      .toPromise();
  }

  downloadDocument(id: number) {
    return this.http
      .get<{ fileContent: string; fileName: string; mimeType: string }>(
        `${environment.apiUrl}/documents/${id}/download`
      )
      .toPromise();
  }
}
