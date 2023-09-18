import { Injectable } from '@angular/core';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuditlogService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/AuditLog`;
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

  constructor(private http: HttpClient) { }
  



  getAuditLog(): Observable<any> {
    this.setHeaders()
    return this.http.get<AuditTrail[]>(this.apiUrl, { headers: this.headers});
  }

  async addAuditLog(AuditTrail: AuditTrail): Promise<AuditTrail> {
    this.setHeaders()
    return firstValueFrom(this.http.post<AuditTrail>(this.apiUrl+ "/AddAuditLog", AuditTrail, { headers: this.headers} ));
  }

}
