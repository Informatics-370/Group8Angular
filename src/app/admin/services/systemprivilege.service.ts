import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemprivilegeService {
  private headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/SystemPrivileges`;
  constructor(private httpClient: HttpClient) { }

  private setHeaders() {
    this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    // Retrieve the token from localStorage
    let token = localStorage.getItem('Token');
    if (token) {  
      token = JSON.parse(token);
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
}


   // SystemPrivileges
   GetSystemPrivileges(): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/GetSystemPrivileges`, { headers: this.headers });
  }
  

  async GetSystemPrivilege(id: string): Promise<SystemPrivilege> {
    this.setHeaders();
    return firstValueFrom(this.httpClient.get<SystemPrivilege>(`${this.apiUrl}/${id}`, { headers: this.headers }));
  }

  AddSystemPrivilege(systemPrivlege: SystemPrivilege): Observable<any> {
    this.setHeaders();
    return this.httpClient.post(`${this.apiUrl}/AddPrivilege`, systemPrivlege, { headers: this.headers });
  }

  UpdateSystemPrivilege(id: string, systemPrivlege: SystemPrivilege): Observable<any> {
    this.setHeaders();
    console.log('Updating system privilege with ID:', id, 'and data:', systemPrivlege);
    return this.httpClient.put(`${this.apiUrl}/${id}`, systemPrivlege, { headers: this.headers });
  }
  
  DeleteSystemPrivilege(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteSystemPrivilege/${id}`, {headers: this.headers});
}

  GetDistinctMethodPrivileges():Observable<any>{
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/MethodMapping`, { headers: this.headers })
  }

  GetMethodPrivilegeIDs(): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/MethodPrivilegeMapping`, { headers: this.headers });
  }

  GetPrivilegeIdByName(privilegeName: string): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/GetIdByName/${privilegeName}`, { headers: this.headers})
  }
}
