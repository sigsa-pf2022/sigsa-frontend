import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  getFamilyGroupsByUserId(id: string){
    return this.http.get(`${environment.apiUrl}family-groups?id=${id}`).toPromise();
  }
}
