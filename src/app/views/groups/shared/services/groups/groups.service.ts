import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FamilyGroup } from '../../interfaces/family-group.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private http: HttpClient) {}

  getFamilyGroupsByUserId(id: string) {
    return this.http.get(`${environment.apiUrl}family-groups?userId=${id}`).toPromise();
  }

  getFamilyGroupsByUser(): Promise<FamilyGroup[]> {
    return this.http.get<FamilyGroup[]>(`${environment.apiUrl}/family-groups/my-groups`).toPromise();
  }

  getFamilyGroupById(id: string): Promise<FamilyGroup> {
    return this.http.get<FamilyGroup>(`${environment.apiUrl}/family-groups/${id}`).toPromise();
  }

  createGroup(data) {
    data.birthday = data.birthday.split('/').reverse().join('-');
    return this.http.post(`${environment.apiUrl}/family-groups/create`, data).toPromise();
  }

  deleteMember(groupId: string, memberId: string) {
    return this.http.delete(`${environment.apiUrl}/family-groups/${groupId}/members/${memberId}`).toPromise();
  }

  /** `photo` es un data URI, o null para borrarla. */
  updateGroupPhoto(groupId: string | number, photo: string | null) {
    return this.http
      .patch<any>(`${environment.apiUrl}/family-groups/${groupId}/photo`, { photo })
      .toPromise();
  }

  addMember(groupId: string, member: any) {
    return this.http.post(
      `${environment.apiUrl}/family-groups/${groupId}/members`,
      member
    ).toPromise();
  }

  getProfessionalRequests(): Promise<any[]> {
    return this.http
      .get<any[]>(`${environment.apiUrl}/family-groups/professional-requests`)
      .toPromise();
  }

  acceptProfessionalRequest(requestId: number): Promise<any> {
    return this.http
      .patch(`${environment.apiUrl}/family-groups/professional-requests/${requestId}/accept`, {})
      .toPromise();
  }

  rejectProfessionalRequest(requestId: number): Promise<any> {
    return this.http
      .patch(`${environment.apiUrl}/family-groups/professional-requests/${requestId}/reject`, {})
      .toPromise();
  }
}
