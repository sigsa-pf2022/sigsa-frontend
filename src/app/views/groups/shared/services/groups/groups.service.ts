import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FamilyGroup } from '../../interfaces/FamilyGroup';

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

  getGroupImage(url: string) {
    return this.http
      .get(`${environment.apiUrl}download-image?url=${url}`, {
        responseType: 'blob',
      })
      .toPromise();
  }
}
