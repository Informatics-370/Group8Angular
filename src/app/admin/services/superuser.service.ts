import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Employee } from 'src/app/Model/employee';
import { Superuser } from 'src/app/Model/superuser';
import { SuperuserRegistrationViewModel } from 'src/app/Model/superuserRegisterViewModel';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperuserService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Superusers`;

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


  GetSuperusers(): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/GetSuperusers`, { headers: this.headers });
  }

  async GetSuperuser(id: string): Promise<Employee> {
    this.setHeaders();
    return firstValueFrom(this.httpClient.get<Superuser>(`${this.apiUrl}/${id}`, { headers: this.headers }));
  }

  AddSuperuser(superuser: SuperuserRegistrationViewModel): Observable<any> {
    this.setHeaders();
    return this.httpClient.post(`${this.apiUrl}/AddSuperuser`, superuser, { headers: this.headers });
  }

  UpdateSuperuser(id: string, superuser: Superuser): Observable<any> {
    this.setHeaders();
    console.log('Updating employee with ID:', id, 'and data:', superuser);
    return this.httpClient.put(`${this.apiUrl}/UpdateSuperUser/${id}`, superuser, { headers: this.headers });
  }
  

  DeleteSuperuser(id: string): Observable<any> {
    this.setHeaders();
    return this.httpClient.delete(`${this.apiUrl}/DeleteSuperuser/${id}`, { headers: this.headers });
  } 
}
