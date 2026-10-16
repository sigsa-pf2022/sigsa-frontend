import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProfessionalNote } from 'src/app/interfaces/professional-note';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient) {}

  /** Indicaciones recibidas por el usuario o, con `dependentId`, por su dependiente. */
  getReceivedNotes(dependentId?: number | null): Promise<ProfessionalNote[]> {
    const params: Record<string, string> = dependentId ? { dependentId: String(dependentId) } : {};
    return this.http
      .get<ProfessionalNote[]>(`${environment.apiUrl}/professionals/notes/received`, { params })
      .toPromise();
  }
}
