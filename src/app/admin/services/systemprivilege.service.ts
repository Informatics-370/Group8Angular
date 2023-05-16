import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemprivilegeService {

  private apiUrl = `${environment.baseApiUrl}api/SystemPrivileges`;
  constructor(private http: HttpClient) { }

   // SystemPrivileges
  GetSystemPrivileges(): Observable<any> {
    return this.http.get<SystemPrivilege>(this.apiUrl);
  }

  async GetSystemPrivilege(id: number): Promise<SystemPrivilege> {
    return firstValueFrom(this.http.get<SystemPrivilege>(`${this.apiUrl}/${id}`));
  }

  async AddSystemPrivilege(systemPrivlege: SystemPrivilege): Promise<SystemPrivilege> {
    return firstValueFrom(this.http.post<SystemPrivilege>(this.apiUrl, systemPrivlege));
  }

  async UpdateSystemPrivilege(id: number, systemPrivlege: SystemPrivilege): Promise<any> {
    console.log('Updating system privilege with ID:', id, 'and data:', systemPrivlege);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, systemPrivlege));
  }
  

  async DeleteSystemPrivilege(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
}
}
