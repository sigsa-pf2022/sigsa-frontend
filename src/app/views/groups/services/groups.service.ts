import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FamilyGroup } from '../interfaces/FamilyGroup';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private http: HttpClient) {}

  getFamilyGroupsByUserId(id: string) {
    return this.http
      .get(`${environment.apiUrl}family-groups?userId=${id}`)
      .toPromise();
  }

  getFamilyGroupById(id: string) {
    return this.http
      .get<FamilyGroup>(`${environment.apiUrl}family-group?id=${id}`)
      .toPromise();
  }

  createGroup(data, user, file) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', data.name);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('dni', data.dni);
    formData.append('bloodType', data.bloodType);
    formData.append('birthday', data.birthday);
    formData.append('createdBy', user);
    return this.http.post(`${environment.apiUrl}create-group`, formData).toPromise();
  }

  getGroupImage(url: string) {
    return this.http
      .get(`${environment.apiUrl}download-image?url=${url}`, {
        responseType: 'blob',
      })
      .toPromise();
  }
}
